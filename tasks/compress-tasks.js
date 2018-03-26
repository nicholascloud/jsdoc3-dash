'use strict';
const config = require('./config');
const exec = require('child_process').exec;

task('compress', function () {
  console.log('compressing docset...');

  const COMPRESS_CMD = `tar --exclude='.DS_Store' -cvzf ${config.ARCHIVE_DEST_PATH} -C ${config.BUILD_DIR} ${config.DOCSET_NAME}`;

  console.log('  >', COMPRESS_CMD);
  exec(COMPRESS_CMD, function (err) {
    if (err) {
      return fail(err);
    }
    complete();
  }, {async: true});
});