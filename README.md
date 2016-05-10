# Auth0 Groups

## Introduction

Use Cases:

 - Coarse Grained Authorization: Only members of group X can access application Y
 - Fine Grained Authorization: Permissions and roles can be exposed to applications
 - Helpdesk: Search for users, block users, unblock users, remove MFA, view user activity, ...

Supports:

 - [x] Heroku deployments
 - [x] Docker deployments
 - [x] Different storage providers:
  - [x] S3
  - [x] MongoDB
  - [x] Simple json file

Todos:

 - [x] Use `uuid` as unique identifier for permissions/roles/groups
 - [ ] Contextual groups/roles/permissions (only for application X)
 - [ ] Assign permissions to roles
 - [ ] Assign roles to groups
 - [ ] Assign groups or roles to applications
 - [ ] Calculate effective permissions for a user
 - [ ] Calculate effective permissions for a role
 - [ ] Calculate effective permissions for a group
 - [ ] Calculate effective permissions for an application
 - [ ] Push to Auth0 (1 big rule that contains authz/permissions/roles/groups)
 - [ ] Secure all endpoints with permissions
 - [ ] Export logs button
 - [ ] Delete device credentials
 - [ ] Impersonation + application configuration (SAML/WSFed/OIDC + scopes)
 - [ ] Use Auth0 OAuth2-as-a-service
 - [ ] Webtaskify
 - [ ] Reset passwords
 - [ ] Create users (with group memberships)
 - [ ] "Session Expired" if JWT is expired or server returns not authenticated
 - [ ] Handle login errors (eg: user blocked)
 - [ ] Store permissions/roles/groups in the user profile also (in addition to having it in the token)

## Configuration

Configure you settings in `/server/config.json` or as environment variables:

 - `AUTH0_DOMAIN`: Your Auth0 domain
 - `AUTH0_CLIENT_ID`: The client_id of your application
 - `AUTH0_CLIENT_SECRET`: The client_secret of your application
 - `AUTH0_APIV2_TOKEN`: The API v2 token for interacting with API v2. Needs the following permissions: `read:clients read:connections read:rules create:rules update:rules read:users update:users read:device_credentials read:logs`

### Data Providers

#### Json Database File

The permissions/roles/groups can be stored in a Json Database File with the following settings:

 - `JSONDB_PATH`: Path to the database file, defaults to `server/db.json'`
 - `DATA_PROVIDER`: `jsondb`

#### MongoDB

The permissions/roles/groups can be stored in a MongoDB with the following settings:

 - `MONGODB_CONNECTION_STRING`: `mongodb://...`
 - `DATA_PROVIDER`: `mongodb`

#### S3

The permissions/roles/groups can be stored in S3 with the following settings:

 - `AWS_S3_BUCKET`: `MY_BUCKET`,
 - `AWS_ACCESS_KEY_ID`: `MY_KEY`,
 - `AWS_SECRET_ACCESS_KEY`: `MY_SECRET_ACCESS_KEY`,

## Deployment

### Running locally

Client:

```
nvm use 4
npm install
npm run client:dev
```

Server:

```
nvm use 4
npm install
npm run server:dev
```

### Running in production

Client:

```
nvm use 4
npm install
npm run client:build
```

Server:

```
nvm use 4
npm install
npm run server:prod
```

### Docker

Building:

```
docker build -t auth0/auth0-authz .
```

Start interactive:

```
docker rm auth0-authz
docker run -it --name "auth0-authz" -p 5000:3000 auth0/auth0-authz
```

Start in the background:

```
docker run -d --name "auth0-authz" -p 5000:3000 auth0/auth0-authz
```
