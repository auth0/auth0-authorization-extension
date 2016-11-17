module.exports = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Auth0 - Authorization</title>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.8.10/lib/logos/img/favicon.png">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css">
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.8.10/index.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css">
  <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="https://s3.amazonaws.com/assets.auth0.com/extensions/develop/auth0-authz/assets/auth0-authz.ui.<%= assets.version %>.css"><% } %>
</head>
<body>
  <div id="app"></div>
  <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.2.min.js"></script>
  <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"></script>
  <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
  <% if (assets.vendors) { %><script type="text/javascript" src="<%= assets.vendors %>"></script><% } %>
  <% if (assets.app) { %><script type="text/javascript" src="<%= assets.app %>"></script><% } %>
  <% if (assets.version) { %>
  <script type="text/javascript" src="https://s3.amazonaws.com/assets.auth0.com/extensions/develop/auth0-authz/assets/auth0-authz.ui.vendors.<%= assets.version %>.js"></script>
  <script type="text/javascript" src="https://s3.amazonaws.com/assets.auth0.com/extensions/develop/auth0-authz/assets/auth0-authz.ui.<%= assets.version %>.js"></script>
  <% } %>
</body>
</html>`;
