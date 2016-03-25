const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const glob = require('glob');
const async = require('async');
const semver = require('semver');
const request = require('request-promise');
const Promise = require('bluebird');

const LIST_MODULES_URL = 'https://webtask.it.auth0.com/api/run/wt-tehsis-gmail_com-1?key=eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJmZGZiOWU2MjQ0YjQ0YWYyYjc2YzAwNGU1NjgwOGIxNCIsImlhdCI6MTQzMDMyNjc4MiwiY2EiOlsiZDQ3ZDNiMzRkMmI3NGEwZDljYzgwOTg3OGQ3MWQ4Y2QiXSwiZGQiOjAsInVybCI6Imh0dHA6Ly90ZWhzaXMuZ2l0aHViLmlvL3dlYnRhc2tpby1jYW5pcmVxdWlyZS90YXNrcy9saXN0X21vZHVsZXMuanMiLCJ0ZW4iOiIvXnd0LXRlaHNpcy1nbWFpbF9jb20tWzAtMV0kLyJ9.MJqAB9mgs57tQTWtRuZRj6NCbzXxZcXCASYGISk3Q6c';

module.exports = new Promise((resolve, reject) => {
  request.get(LIST_MODULES_URL, { json: true }).then((data) => {
    const webtaskModules = data.modules;

    glob('**/package.json', { cwd: path.join(__dirname, '../../') }, (err, matches) => {
      async.map(matches, (file, cb) => fs.readFile(file, 'utf8', cb), (readErr, results) => {
        if (readErr) {
          reject(readErr);
        }

        // Flatten all dependencies.
        const allDependencies = results.map(file => JSON.parse(file).dependencies);
        const dependencyTree = _.reduce(allDependencies, (output, dependencies) => {
          _.keys(dependencies).forEach(moduleName => {
            const version = dependencies[moduleName];
            const versions = output[moduleName] || [ ];
            if (versions.indexOf(version) === -1) {
              versions.push(version);
            }
            output[moduleName] = versions;
          });
          return output;
        }, { });

        // Sort the dependencies.
        const ordered = {};
        Object.keys(dependencyTree).sort().forEach((key) => {
          ordered[key] = dependencyTree[key];
        });

        // Calculate externals.
        const externals = _.reduce(dependencyTree, (output, versions, moduleName) => {
          const webtaskModule = _.find(webtaskModules, { name: moduleName });
          if (webtaskModule && webtaskModule.version !== 'native') {
            if (versions && versions.length === 1 && semver.satisfies(webtaskModule.version, versions[0])) {
              output.compatible[moduleName] = true;
            } else {
              output.incompatible[moduleName] = { local: versions, webtask: webtaskModule.version };
            }
          } else {
            output.incompatible[moduleName] = { local: versions, webtask: 'N/A' };
          }

          return output;
        }, { compatible: { }, incompatible: { } });
        resolve(externals);
      });
    });
  })
  .catch(reject);
});
