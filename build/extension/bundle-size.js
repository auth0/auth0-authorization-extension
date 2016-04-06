const _ = require('lodash');
const bundle = require('./bundle-size.json');

console.log('\r\n Extension Module Size:\r\n');

_.chain(bundle.chunks[0].modules)
  .sortByOrder([ 'size' ], [ false ])
  .filter((m) => m.size > 5000)
  .value()
  .forEach(m => console.log(`  ${m.name}: ${Math.round(m.size/1024)} KB`));

console.log('\r\n');
