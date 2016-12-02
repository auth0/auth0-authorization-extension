# Auth0 Authorization Extension

## Running in Production

```bash
npm install
npm run client:build
npm run server:prod
```

## Running in Development

Update the configuration file under `./server/config.json`:

```json
{
	"AUTHORIZE_API_KEY": "mysecret",
	"EXTENSION_SECRET": "mysecret",
	"AUTH0_DOMAIN": "me.auth0.com",
	"AUTH0_CLIENT_ID": "myclientid",
	"AUTH0_CLIENT_SECRET": "myclientsecret"
}
```

Then you can run the extension:

```bash
npm install
npm run serve:dev
```
