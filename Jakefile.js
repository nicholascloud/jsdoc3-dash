'use strict';
require('./tasks');
const exec = require('child_process').exec;

task('default', function () {
  console.log('Type `jake -T` for a list of all tasks.');
  exec('jake -T', function (err, stdout, stderr) {
    if (err) {
      console.error(err);
      console.error(stderr);
      process.exit(1);
    }
    console.log(stdout);
    process.exit(0);
  });
});