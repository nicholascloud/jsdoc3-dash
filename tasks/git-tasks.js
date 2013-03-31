/*global namespace, task, desc, complete*/
'use strict';
var exec = require('child_process').exec,
  config = require('./config');

var CLONE_CMD = 'git clone ' + config.REPO_URL + ' ' + config.TMP_DIR;

namespace('git', function () {
  task('clone', {async: true}, function () {
    console.log('Cloning jsdoc3 repo...');
    console.log('  >', CLONE_CMD);
    exec(CLONE_CMD, function (err) {
      if (err) {
        console.error(err);
      }
      complete(err);
    });
  }, {async: true});
});