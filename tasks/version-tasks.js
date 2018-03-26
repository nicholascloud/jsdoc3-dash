'use strict';
const fs = require('fs');
const config = require('./config');

namespace('version', function () {

  /**
   * Commits the version number by writing it to /version.semver
   */
  task('commit', function () {
    console.log('committing version...');
    fs.writeFile(config.VERSION_FILE, config.WORKING_VERSION, function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});
});