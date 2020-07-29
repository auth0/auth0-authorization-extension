const path = require("path");
const nconf = require("nconf");

const logger = require("./server/lib/logger");

// Initialize babel.
require("babel-core/register")({
  ignore: /node_modules/,
  sourceMaps: !(process.env.NODE_ENV === "production"),
  plugins: [
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-object-rest-spread",
  ],
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ],
});
require("babel-polyfill");

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, "./server/config.json"))
  .defaults({
    AUTH0_RTA: "auth0.auth0.com",
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: "development",
    HOSTING_ENV: "default",
    PORT: 3001,
    USE_OAUTH2: false,
    LOG_COLOR: true,
  });

// Start the server.
return require("./server/init")(
  (key) => nconf.get(key),
  null,
  (err, hapi) => {
    if (err) {
      return logger.error(err);
    }

    return hapi.start(() => {
      logger.info("Server running at:", hapi.info.uri);
    });
  }
);
