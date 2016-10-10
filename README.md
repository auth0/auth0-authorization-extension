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
	"WT_URL": "http://localhost:3000/",
	"AUTH0_DOMAIN": "me.auth0.com",
	"AUTH0_CLIENT_ID": "myclientid",
	"AUTH0_CLIENT_SECRET": "myclientsecret",
	"AUTH0_APIV2_TOKEN": "mytoken"
}
```

Then you can run the extension:

```bash
npm install
npm run serve:dev
```

In order to login, you'll also need to run `ngrok` locally:

```bash
./ngrok http 3001
```

After that you can navigate to this url to login with your Dashboard Admin account:

```
https://YOUR-DOMAIN.ngrok.io/admins/login
```
