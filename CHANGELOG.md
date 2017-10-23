## [2.4.3] - 2017-10-23

- Fixed bug with random order of the group members. Now they are sorted by ids
- Fixed API authorization error

## [2.4.2] - 2017-07-31

- Prevent UI from crashing when user no longer exists in Auth0

## [2.4.1] - 2017-05-04

- Solve UI issue caused by redux logger

## [2.4.0] - 2017-05-04

- Add Amazon S3 as a supported storage provider.
- Fixes for parallel writes when using Webtask Storage

## [2.3.0] - 2017-04-10

- Additional logic to make sure only clients (and not end-users) can interact with the API.

> Note: this change was retroactively applied to all other minor versions.

## [2.2.0] - 2017-03-24

- Add Amazon S3 as a supported storage provider.

> Note: this release has been removed due to issues in the Extensions Gallery

## [2.1.2] - 2017-02-17

- Add `?expand=true` support to `/api/users/<userId>/groups` ([commit](https://github.com/auth0/auth0-authorization-extension/commit/8d4771dcb42317b9d314592b1f573e6951a84274))

## [2.1.1] - 2017-02-17

- Fixes to the build process

## [2.1.0] - 2017-02-17

- Update `auth0-extension-hapi-tools` which fixes issues with the appliance, URL helpers and the logout url
- Display the connection name in the user picker [#136](https://github.com/auth0/auth0-authorization-extension/pull/136)
- Add `?expand=true` support to `/api/groups/<groupId>` ([commit](https://github.com/auth0/auth0-authorization-extension/commit/87463b12ad7529cdca7a65538b0951eb1c5b52e8))

## [2.0.10] - 2016-12-21

- The rule template will now fallback to user.identities.connectionName when the delegation endpoint is being used

## [2.0.9] - 2016-12-21

- Group / Members tab has error if you delete a user in the Dashboard that's been assigned to the group [#126](https://github.com/auth0/auth0-authorization-extension/issues/123)
- When adding a user to a role/group, removing the user from a role/group the "All Roles" tab should be refreshed
- When adding a user to a role, the Roles tab should keep focus
- The "All Roles" tab on the user should also show direct role memberships
- Fix the edit role dialog [#127](https://github.com/auth0/auth0-authorization-extension/pull/127)
- Better placeholder when there are no users [#126](https://github.com/auth0/auth0-authorization-extension/issues/126)

## [2.0.0] - 2016-12

- Support for Roles
- Support for Permissions

## [1.0.0]

- Support for Groups
