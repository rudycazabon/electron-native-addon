var addon = require('bindings')('hello');

console.log(addon.hello()); // 'world'

process.exit(0);