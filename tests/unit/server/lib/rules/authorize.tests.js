import { expect } from "chai";
import vm from "vm";
import compileRule from "../../../../../server/lib/compileRule";
import config from "../../../../../server/lib/config";

const _ = require("lodash");

// runner.js (loaded by mocha.js) sets config provider with PUBLIC_WT_URL: 'http://foo'
const mockStorage = { getApiKey: () => Promise.resolve("test-api-key") };
const mockAuth0Compile = {}; // not called when key already exists

function buildRule(config) {
  return compileRule(mockStorage, mockAuth0Compile, config, "test-user");
}

function runRule(ruleStr, { user, context, requestMock, auth0Mock }) {
  const ruleFn = vm.runInNewContext(`(${ruleStr})`, {
    request: requestMock,
    configuration: { AUTHZ_EXT_API_KEY: "test-api-key" },
    auth0: auth0Mock || {},
    UnauthorizedError: class UnauthorizedError extends Error {
      constructor(msg) {
        super(msg);
        this.name = "UnauthorizedError";
      }
    },
    console,
    require: (mod) => {
      // the old version of the rule required lodash, uncomment this to test the old version
      // if (mod === 'lodash') return _;
      throw new Error(`Module not found: ${mod}`);
    },
  });

  return new Promise((resolve, reject) => {
    ruleFn(user, context, (err, u, c) => {
      if (err) reject(err);
      else resolve({ user: u, context: c });
    });
  });
}

const defaultUser = {
  user_id: "auth0|test123",
  name: "Test User",
  identities: [{ connection: "Username-Password-Authentication" }],
};

const defaultContext = {
  clientID: "test-client-id",
  connection: "Username-Password-Authentication",
  request: {},
};

function makeSuccessRequest(
  data = { groups: ["g1"], roles: ["r1"], permissions: ["p1"] },
) {
  return {
    post: (options, cb) => cb(null, { statusCode: 200 }, data),
  };
}

// ─── Phase 1: compiled output assertions ─────────────────────────────────────

describe("authorize rule - compiled output", () => {
  describe("extensionUrl", () => {
    it("embeds PUBLIC_WT_URL in the rule", async () => {
      const rule = await buildRule({});
      const expectedUrl = config("PUBLIC_WT_URL").replace(/\/$/, "");
      expect(rule).to.include(`var EXTENSION_URL = "${expectedUrl}"`);
    });
  });

  describe("token flags - groups", () => {
    it("omits user.groups assignment when groupsInToken is false", async () => {
      const rule = await buildRule({});
      expect(rule).to.not.include("user.groups = data.groups");
      expect(rule).to.not.include("user.groups = mergeRecords");
    });

    it("assigns user.groups = data.groups when groupsInToken true, no passthrough", async () => {
      const rule = await buildRule({
        groupsInToken: true,
        groupsPassthrough: false,
      });
      expect(rule).to.include("user.groups = data.groups;");
      expect(rule).to.not.include(
        "user.groups = mergeRecords(user.groups, data.groups)",
      );
    });

    it("uses mergeRecords for groups when groupsInToken and groupsPassthrough are true", async () => {
      const rule = await buildRule({
        groupsInToken: true,
        groupsPassthrough: true,
      });
      expect(rule).to.include(
        "user.groups = mergeRecords(user.groups, data.groups);",
      );
      expect(rule).to.not.include("user.groups = data.groups;");
    });
  });

  describe("token flags - roles", () => {
    it("omits user.roles assignment when rolesInToken is false", async () => {
      const rule = await buildRule({});
      expect(rule).to.not.include("user.roles = data.roles");
      expect(rule).to.not.include("user.roles = mergeRecords");
    });

    it("assigns user.roles = data.roles when rolesInToken true, no passthrough", async () => {
      const rule = await buildRule({
        rolesInToken: true,
        rolesPassthrough: false,
      });
      expect(rule).to.include("user.roles = data.roles;");
      expect(rule).to.not.include(
        "user.roles = mergeRecords(user.roles, data.roles)",
      );
    });

    it("uses mergeRecords for roles when rolesInToken and rolesPassthrough are true", async () => {
      const rule = await buildRule({
        rolesInToken: true,
        rolesPassthrough: true,
      });
      expect(rule).to.include(
        "user.roles = mergeRecords(user.roles, data.roles);",
      );
      expect(rule).to.not.include("user.roles = data.roles;");
    });
  });

  describe("token flags - permissions", () => {
    it("omits user.permissions assignment when permissionsInToken is false", async () => {
      const rule = await buildRule({});
      expect(rule).to.not.include("user.permissions = data.permissions");
      expect(rule).to.not.include("user.permissions = mergeRecords");
    });

    it("assigns user.permissions = data.permissions when permissionsInToken true, no passthrough", async () => {
      const rule = await buildRule({
        permissionsInToken: true,
        permissionsPassthrough: false,
      });
      expect(rule).to.include("user.permissions = data.permissions;");
      expect(rule).to.not.include(
        "user.permissions = mergeRecords(user.permissions, data.permissions)",
      );
    });

    it("uses mergeRecords for permissions when permissionsInToken and permissionsPassthrough are true", async () => {
      const rule = await buildRule({
        permissionsInToken: true,
        permissionsPassthrough: true,
      });
      expect(rule).to.include(
        "user.permissions = mergeRecords(user.permissions, data.permissions);",
      );
      expect(rule).to.not.include("user.permissions = data.permissions;");
    });
  });

  describe("persist flags", () => {
    it("omits saveToMetadata and uses direct callback when no persist flags are set", async () => {
      const rule = await buildRule({});
      expect(rule).to.not.include("saveToMetadata");
      expect(rule).to.include("return callback(null, user, context)");
    });

    it("includes saveToMetadata with groups when persistGroups is true", async () => {
      const rule = await buildRule({ persistGroups: true });
      expect(rule).to.include("function saveToMetadata");
      expect(rule).to.include(
        "saveToMetadata(user, data.groups, data.roles, data.permissions",
      );
      expect(rule).to.include("groups: groups,");
      expect(rule).to.not.include("groups: mergeRecords(user.groups, groups)");
    });

    it("includes saveToMetadata with roles when persistRoles is true", async () => {
      const rule = await buildRule({ persistRoles: true });
      expect(rule).to.include("function saveToMetadata");
      expect(rule).to.include("roles: roles,");
      expect(rule).to.not.include("roles: mergeRecords(user.roles, roles)");
    });

    it("includes saveToMetadata with permissions when persistPermissions is true", async () => {
      const rule = await buildRule({ persistPermissions: true });
      expect(rule).to.include("function saveToMetadata");
      expect(rule).to.include("permissions: permissions");
      expect(rule).to.not.include(
        "permissions: mergeRecords(user.permissions, permissions)",
      );
    });

    it("uses mergeRecords inside saveToMetadata when persistGroups and groupsPassthrough are true", async () => {
      const rule = await buildRule({
        persistGroups: true,
        groupsPassthrough: true,
      });
      expect(rule).to.include("groups: mergeRecords(user.groups, groups),");
      expect(rule).to.not.include("groups: groups,");
    });

    it("uses mergeRecords inside saveToMetadata when persistRoles and rolesPassthrough are true", async () => {
      const rule = await buildRule({
        persistRoles: true,
        rolesPassthrough: true,
      });
      expect(rule).to.include("roles: mergeRecords(user.roles, roles),");
      expect(rule).to.not.include("roles: roles,");
    });

    it("uses mergeRecords inside saveToMetadata when persistPermissions and permissionsPassthrough are true", async () => {
      const rule = await buildRule({
        persistPermissions: true,
        permissionsPassthrough: true,
      });
      expect(rule).to.include(
        "permissions: mergeRecords(user.permissions, permissions)",
      );
      expect(rule).to.not.include("permissions: permissions\n");
    });
  });

  describe("mergeRecords function", () => {
    it("omits mergeRecords function when no passthrough flags are set", async () => {
      const rule = await buildRule({
        groupsInToken: true,
        rolesInToken: true,
        persistGroups: true,
      });
      expect(rule).to.not.include("function mergeRecords");
    });

    it("includes mergeRecords function when groupsPassthrough is true", async () => {
      const rule = await buildRule({ groupsPassthrough: true });
      expect(rule).to.include("function mergeRecords");
    });

    it("includes mergeRecords function when rolesPassthrough is true", async () => {
      const rule = await buildRule({ rolesPassthrough: true });
      expect(rule).to.include("function mergeRecords");
    });

    it("includes mergeRecords function when permissionsPassthrough is true", async () => {
      const rule = await buildRule({ permissionsPassthrough: true });
      expect(rule).to.include("function mergeRecords");
    });
  });
});

// ─── Phase 2: runtime execution ──────────────────────────────────────────────

describe("authorize rule - runtime", () => {
  describe("happy path", () => {
    it("sets user.groups, roles, permissions from policy response", async () => {
      const rule = await buildRule({
        groupsInToken: true,
        rolesInToken: true,
        permissionsInToken: true,
      });

      const { user } = await runRule(rule, {
        user: { ...defaultUser },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest({
          groups: ["admin"],
          roles: ["editor"],
          permissions: ["read"],
        }),
      });

      expect(user.groups).to.deep.equal(["admin"]);
      expect(user.roles).to.deep.equal(["editor"]);
      expect(user.permissions).to.deep.equal(["read"]);
    });

    it("does not set user.groups when groupsInToken is false", async () => {
      const rule = await buildRule({});
      const { user } = await runRule(rule, {
        user: { ...defaultUser },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest(),
      });

      expect(user.groups).to.be.undefined;
    });
  });

  describe("passthrough / mergeRecords", () => {
    it("merges IdP groups with extension groups when groupsPassthrough is true", async () => {
      const rule = await buildRule({
        groupsInToken: true,
        groupsPassthrough: true,
      });
      const { user } = await runRule(rule, {
        user: { ...defaultUser, groups: ["idp-group"] },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest({
          groups: ["ext-group"],
          roles: [],
          permissions: [],
        }),
      });

      expect(user.groups).to.include("idp-group");
      expect(user.groups).to.include("ext-group");
    });

    it("deduplicates groups that appear in both IdP and extension", async () => {
      const rule = await buildRule({
        groupsInToken: true,
        groupsPassthrough: true,
      });
      const { user } = await runRule(rule, {
        user: { ...defaultUser, groups: ["shared-group"] },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest({
          groups: ["shared-group", "ext-only"],
          roles: [],
          permissions: [],
        }),
      });

      const count = user.groups.filter((g) => g === "shared-group").length;
      expect(count).to.equal(1);
      expect(user.groups).to.include("ext-only");
    });

    it("parses SAML comma-separated string groups in passthrough", async () => {
      const rule = await buildRule({
        groupsInToken: true,
        groupsPassthrough: true,
      });
      const { user } = await runRule(rule, {
        user: { ...defaultUser, groups: "saml-group-a, saml-group-b" },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest({
          groups: ["ext-group"],
          roles: [],
          permissions: [],
        }),
      });

      expect(user.groups).to.include("saml-group-a");
      expect(user.groups).to.include("saml-group-b");
      expect(user.groups).to.include("ext-group");
    });
  });

  describe("policy request errors", () => {
    it("calls callback with UnauthorizedError when policy returns non-200", async () => {
      const rule = await buildRule({ groupsInToken: true });
      const error = await runRule(rule, {
        user: { ...defaultUser },
        context: { ...defaultContext },
        requestMock: {
          post: (opts, cb) =>
            cb(null, { statusCode: 403, body: "Forbidden" }, null),
        },
      })
        .then(() => null)
        .catch((err) => err);

      expect(error).to.be.instanceOf(Error);
      expect(error.name).to.equal("UnauthorizedError");
      expect(error.message).to.include("Authorization Extension");
    });

    it("rejects non-200 via the status check, not a null data error (no token flags)", async () => {
      // With no token/persist flags, data is never accessed — so if the non-200 check is
      // removed, the rule calls callback(null, user, context) and this test fails.
      const rule = await buildRule({});
      const error = await runRule(rule, {
        user: { ...defaultUser },
        context: { ...defaultContext },
        requestMock: {
          post: (opts, cb) =>
            cb(null, { statusCode: 403, body: "Forbidden" }, null),
        },
      })
        .then(() => null)
        .catch((err) => err);

      expect(error).to.be.instanceOf(Error);
      expect(error.name).to.equal("UnauthorizedError");
      expect(error.message).to.equal("Authorization Extension: Forbidden");
    });

    it("calls callback with UnauthorizedError on network error", async () => {
      const rule = await buildRule({ groupsInToken: true });
      const error = await runRule(rule, {
        user: { ...defaultUser },
        context: { ...defaultContext },
        requestMock: {
          post: (opts, cb) => cb(new Error("ECONNREFUSED"), null, null),
        },
      })
        .then(() => null)
        .catch((err) => err);

      expect(error).to.be.instanceOf(Error);
      expect(error.name).to.equal("UnauthorizedError");
      expect(error.message).to.include("ECONNREFUSED");
    });

    it("rejects urn:auth0-authz-api audience from query params", async () => {
      const rule = await buildRule({});
      const error = await runRule(rule, {
        user: { ...defaultUser },
        context: {
          ...defaultContext,
          request: { query: { audience: "urn:auth0-authz-api" } },
        },
        requestMock: makeSuccessRequest(),
      })
        .then(() => null)
        .catch((err) => err);

      expect(error).to.be.instanceOf(Error);
      expect(error.name).to.equal("UnauthorizedError");
      expect(error.message).to.equal("no_end_users");
    });

    it("rejects urn:auth0-authz-api audience from request body", async () => {
      const rule = await buildRule({});
      const error = await runRule(rule, {
        user: { ...defaultUser },
        context: {
          ...defaultContext,
          request: { body: { audience: "urn:auth0-authz-api" } },
        },
        requestMock: makeSuccessRequest(),
      })
        .then(() => null)
        .catch((err) => err);

      expect(error).to.be.instanceOf(Error);
      expect(error.name).to.equal("UnauthorizedError");
      expect(error.message).to.equal("no_end_users");
    });
  });

  describe("persist flags", () => {
    it("calls auth0.users.updateAppMetadata with groups when persistGroups is true", async () => {
      const rule = await buildRule({ persistGroups: true });
      let capturedUserId, capturedMetadata;
      const auth0Mock = {
        users: {
          updateAppMetadata: (userId, metadata) => {
            capturedUserId = userId;
            capturedMetadata = metadata;
            return Promise.resolve();
          },
        },
      };

      await runRule(rule, {
        user: { ...defaultUser },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest({
          groups: ["g1"],
          roles: ["r1"],
          permissions: ["p1"],
        }),
        auth0Mock,
      });

      expect(capturedUserId).to.equal(defaultUser.user_id);
      expect(capturedMetadata.authorization.groups).to.deep.equal(["g1"]);
    });

    it("does not call updateAppMetadata when no persist flags are set", async () => {
      const rule = await buildRule({ groupsInToken: true });
      let called = false;
      const auth0Mock = {
        users: {
          updateAppMetadata: () => {
            called = true;
            return Promise.resolve();
          },
        },
      };

      await runRule(rule, {
        user: { ...defaultUser },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest(),
        auth0Mock,
      });

      expect(called).to.be.false;
    });

    it("propagates updateAppMetadata failure through callback", async () => {
      const rule = await buildRule({ persistGroups: true });
      const auth0Mock = {
        users: {
          updateAppMetadata: () =>
            Promise.reject(new Error("metadata update failed")),
        },
      };

      const error = await runRule(rule, {
        user: { ...defaultUser },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest({
          groups: ["g1"],
          roles: [],
          permissions: [],
        }),
        auth0Mock,
      })
        .then(() => null)
        .catch((err) => err);

      expect(error).to.be.instanceOf(Error);
      expect(error.message).to.include("metadata update failed");
    });

    it("persists merged groups when persistGroups and groupsPassthrough are true", async () => {
      const rule = await buildRule({
        persistGroups: true,
        groupsPassthrough: true,
      });
      let capturedMetadata;
      const auth0Mock = {
        users: {
          updateAppMetadata: (userId, metadata) => {
            capturedMetadata = metadata;
            return Promise.resolve();
          },
        },
      };

      await runRule(rule, {
        user: { ...defaultUser, groups: ["idp-group"] },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest({
          groups: ["ext-group"],
          roles: [],
          permissions: [],
        }),
        auth0Mock,
      });

      expect(capturedMetadata.authorization.groups).to.include("idp-group");
      expect(capturedMetadata.authorization.groups).to.include("ext-group");
    });
  });

  describe("all flags enabled", () => {
    it("sets all token claims and persists merged metadata", async () => {
      const rule = await buildRule({
        groupsInToken: true,
        groupsPassthrough: true,
        rolesInToken: true,
        rolesPassthrough: true,
        permissionsInToken: true,
        permissionsPassthrough: true,
        persistGroups: true,
        persistRoles: true,
        persistPermissions: true,
      });

      let capturedMetadata;
      const auth0Mock = {
        users: {
          updateAppMetadata: (userId, metadata) => {
            capturedMetadata = metadata;
            return Promise.resolve();
          },
        },
      };

      const { user } = await runRule(rule, {
        user: {
          ...defaultUser,
          groups: ["idp-group"],
          roles: ["idp-role"],
          permissions: ["idp-perm"],
        },
        context: { ...defaultContext },
        requestMock: makeSuccessRequest({
          groups: ["ext-group"],
          roles: ["ext-role"],
          permissions: ["ext-perm"],
        }),
        auth0Mock,
      });

      expect(user.groups).to.include("idp-group");
      expect(user.groups).to.include("ext-group");
      expect(user.roles).to.include("idp-role");
      expect(user.roles).to.include("ext-role");
      expect(user.permissions).to.include("idp-perm");
      expect(user.permissions).to.include("ext-perm");
      expect(capturedMetadata.authorization.groups).to.include("idp-group");
      expect(capturedMetadata.authorization.groups).to.include("ext-group");
      expect(capturedMetadata.authorization.roles).to.include("idp-role");
      expect(capturedMetadata.authorization.roles).to.include("ext-role");
      expect(capturedMetadata.authorization.permissions).to.include("idp-perm");
      expect(capturedMetadata.authorization.permissions).to.include("ext-perm");
    });
  });
});
