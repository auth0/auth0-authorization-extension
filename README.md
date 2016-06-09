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
  "AWS_S3_BUCKET": "mybucket",
  "AWS_ACCESS_KEY_ID": "mykey",
  "AWS_SECRET_ACCESS_KEY": "myaccesskey",
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
