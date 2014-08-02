'use strict';
var config = require('./config'),
  exec = require('child_process').exec;

/*jshint quotmark:false*/
var COMPRESS_CMD = "tar --exclude='.DS_Store' -cvzf " +
  config.ARCHIVE_DEST_PATH + " -C " +
  config.BUILD_DIR + " " +
  config.DOCSET_NAME;
/*jshint quotmark:true*/

task('archive', function () {
  console.log('Archiving docset...');
  console.log('  >', COMPRESS_CMD);
  exec(COMPRESS_CMD, function (err) {
    if (err) {
      console.error(err);
    }
    return complete(err);
  }, {async: true});
});