## [2.6.0] - 2019-02-06

- Added function to convert user.groups from string to array.

## [2.6.0] - 2019-01-18

- Added possibility to rotate ApiKey.
- Now saving ApiKey to rules-configs instead of adding it into the rule.
- API: add groups/roles to user by id or name

## [2.5.2] - 2018-11-28

- `babel-polyfill` for IE11 support. #232

## [2.5.1] - 2018-10-18

- [#230](https://github.com/auth0/auth0-authorization-extension/pull/230) - Use dedicated nonce key as `authz-nonce` to avoid collisions

## [2.5.0] - 2018-08-30

- Search Engine Autodetect (V3 for cloud, V2 for PSaaS)

## [2.4.10] - 2018-04-23

- Multipart request for clients and connections paging

## [2.4.9] - 2017-12-20

- Optimizations to avoid Blocking event loop

## [2.4.8] - 2017-12-14
- Uses `setImmediate` to avoid blocks

## [2.4.7] - 2017-11-28

- Attempt to reduce blocked event loop errors

## [2.4.6] - 2017-11-23

- Get roles for all groups (including parent groups) [bugfix]

## [2.4.5] - 2017-11-22

- `/policy` endpoint refactor

## [2.4.4] - 2017-10-30

- Adds support for Rate Limiting headers in API
- Adds retry logic for Management API rate limiting errors

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
