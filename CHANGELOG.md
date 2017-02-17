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
