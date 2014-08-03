'use strict';
var config = require('./config'),
  exec = require('child_process').exec;

task('compress', function () {
  console.log('compressing docset...');

  /*jshint quotmark:false*/
  var COMPRESS_CMD = "tar --exclude='.DS_Store' -cvzf " +
    config.ARCHIVE_DEST_PATH + " -C " +
    config.BUILD_DIR + " " +
    config.DOCSET_NAME;
  /*jshint quotmark:true*/

  console.log('  >', COMPRESS_CMD);
  exec(COMPRESS_CMD, function (err) {
    if (err) {
      return fail(err);
    }
    complete();
  }, {async: true});
});