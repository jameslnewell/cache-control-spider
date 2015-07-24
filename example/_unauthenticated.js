
var factory = require('./factory');

factory()
  .add(process.argv.length > 2 ? process.argv[2] : 'http://dev.online4.nib.com.au/')
  .start()
;