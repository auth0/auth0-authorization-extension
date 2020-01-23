# Auth0 Authorization Extension

This extension provides authorization features for Auth0 focused on RBAC and user group management.

## Documentation

We provide documentation on how to install and use the Authorization Extension on the [Auth0 docs website](https://auth0.com/docs/extensions/authorization-extension/v2).

#### How does this compare to the core Authorization features in Auth0?

We have RBAC available in Auth0 as a core feature of the platform, rather than requiring the use of this extension. We plan on supporting user groups in the near future as well.

For a detailed summary of the differences between this extension and the core features of the platform, [check this document](https://auth0.com/docs/authorization/concepts/core-vs-extension).

We advise using the core capabilities *rather than the extension* as they are built to meet the high scalability needs of the Auth0 platform.

#### Why do we rely on a fork of `hapi`?

Due to the SameSite cookie changes in browsers, we needed a version of Hapi that supported the changes. The easiest path forward was to fork Hapi and port the changes needed over, as we are relying on an older version of Hapi that is not receiving the updates required to respect SameSite cookies.

## Development Setup

**Requires Node 8** - higher versions not yet supported. If you are using `nvm`, simply run `nvm use` inside the directory to switch to the correct version.

1. Clone this repo.
2. Run `npm install`.
3. Build the client: `npm run build`.
4. Ensure `ngrok` is installed globally (`npm i -g ngrok`).
5. Run tests with `npm test`.

### Create a local config

To run the extension, you'll need a file in `server/config.json` that specifies how the extension interacts with Auth0. Here is a sample for running the extension with a production tenant:

```
{
	"AUTH0_DOMAIN": "mytenant.auth0.com",
	"AUTH0_CLIENT_ID": "qwerty123",
	"AUTH0_CLIENT_SECRET": "longer-secret-value",
	"EXTENSION_CLIENT_ID": "abcd123",
	"EXTENSION_SECRET": "longer-secret-value",
	"WT_URL": "http://localhost:3000",
	"PUBLIC_WT_URL": "http://localhost:3000",
	"AUTH0_RTA": "https://auth0.auth0.com"
}
```

Copy this config into the file created at `server/config.json`, and modify the following values:

1. Set your tenant name in the `AUTH0_DOMAIN` option.
2. Create a client in that tenant. This client should be an SPA (Single Page App).
3. Enter the client ID and client secret as both the `AUTH0_CLIENT_ID/_SECRET` as well as the `EXTENSION_CLIENT_ID/_SECRET`.
4. Start a local ngrok server on port 3000 (`ngrok http 3000`).
5. Enter the ngrok URL into the `WT_URL` and `PUBLIC_WT_URL` options.

Start the server in production mode with:

```
npm run serve:prod
```

You can then open the ngrok URL to use the extension.

## Running in development mode

TODO. We need to fix the gulpfile.