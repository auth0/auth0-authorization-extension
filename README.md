# Auth0 Identity & Access Management Dashboard

## Introduction

Use Cases:

 - Coarse Grained Authorization: Only members of group X can access application Y
 - Fine Grained Authorization: Permissions and roles can be exposed to applications
 - Helpdesk: Search for users, block users, unblock users, remove MFA, view user activity, ...

## Configuration

Configure you settings in `/server/config.json` or as environment variables:

 - `AUTH0_DOMAIN`: Your Auth0 domain
 - `AUTH0_CLIENT_ID`: The client_id of your application
 - `AUTH0_CLIENT_SECRET`: The client_secret of your application
 - `AUTH0_APIV2_TOKEN`: The API v2 token for interacting with API v2. Needs the following permissions: `read:clients update:users read:users read:device_credentials delete:device_credentials`

## Deployment

### Running locally

Client:

```
nvm use 4
npm install
npm run build:dev
```

Server:

```
nvm use 4
npm install
npm run serve:dev
```

### Running in production

Client:

```
nvm use 4
npm install
npm run build:prod
```

Server:

```
nvm use 4
npm install
npm run serve:prod
```
