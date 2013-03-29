/*global namespace, task, desc, complete*/
'use strict';
require('./tasks');

task('default', function () {
  console.log('Type `jake -T` for a list of all tasks.');
});