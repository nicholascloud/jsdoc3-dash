'use strict';
var version = require('./version');

namespace('version', function () {
  /**
   * Increments the version number used for the build
   */
  task('increment', function () {
    console.log('incrementing version...');
    version.inc(version.PATCH, function (err, newVersion) {
      if (err) {
        return fail(err);
      }
      console.info('  > new version: %s', newVersion);
      complete();
    });
  }, {async: true});

  /**
   * Commits the version number by writing it to /version.semver
   */
  task('commit', function () {
    console.log('committing version...');
    version.commit(function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});
});