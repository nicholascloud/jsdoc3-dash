/*global namespace, task, desc, complete*/
'use strict';
var config = require('./config'),
  fs = require('fs'),
  path = require('path'),
  exec = require('child_process').exec;

var COMPRESS_CMD = "tar --exclude='.DS_Store' -cvzf " +
  config.ARCHIVE_DEST_PATH + " -C " +
  config.BUILD_DIR + " " +
  config.DOCSET_NAME;

task('archive', {async: true}, function () {
  console.log('Archiving docset...');
  console.log('  >', COMPRESS_CMD);
  exec(COMPRESS_CMD, function (err) {
    if (err) {
      console.error(err);
    }
    return complete(err);
  });
});