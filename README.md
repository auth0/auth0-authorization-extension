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

### Docker

Building:

```
docker build -t auth0/iam-dashboard .
```

Start interactive:

```
docker rm iam-dashboard
docker run -it --name "iam-dashboard" -p 5000:3000 auth0/iam-dashboard
```

Start in the background:

```
docker run -d --name "iam-dashboard" -p 5000:3000 auth0/iam-dashboard
```
