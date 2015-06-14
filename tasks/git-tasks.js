'use strict';
var exec = require('child_process').exec,
  config = require('./config'),
  async = require('async'),
  fs = require('fs'),
  semver = require('semver'),
  EOL = require('os').EOL;

namespace('git', function () {
  /**
   * Clones the jsdoc3 *website* repository
   */
  task('clone', {async: true}, function () {
    var CLONE_CMD = 'git clone ' + config.REPO_URL + ' ' + config.TMP_DIR;
    console.log('Cloning jsdoc3 repo...');
    console.log('  >', CLONE_CMD);
    exec(CLONE_CMD, function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});

  /**
   * Checks out the current working version
   */
  task('checkout', {async: true}, function () {
    var CHECKOUT_CMD = 'git checkout %1'.replace('%1', config.WORKING_VERSION);
    console.log('Checking out latest version...');
    console.log('  >', CHECKOUT_CMD);
    exec(CHECKOUT_CMD, {cwd: config.TMP_DIR}, function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  });

  task('check', {async: true}, function () {
    var REMOTE_TAG_CMD = "git ls-remote --tags %1 | awk '/[0-9]$/ {print $2}'";
    console.log('Comparing latest hashes...');

    function fetchLastVersion(cb) {
      fs.readFile(config.VERSION_FILE, function (err, buffer) {
        if (err) {
          console.warn(err);
        }
        // ignore errors; return empty string and we will just rebuild
        cb(null, (buffer || '').toString());
      });
    }

    function fetchLatestTag(cb) {
      var cmd = REMOTE_TAG_CMD.replace('%1', config.REPO_URL);
      console.log('  >', cmd);
      exec(cmd, function (err, stdout/*, stderr*/) {
        if (err) return cb(err);
        var tagRefs = (stdout || '').toString().trim();
        if (!tagRefs) {
          return cb(new Error('no tag refs found in git:check::fetchLatestTag()'));
        }
        // extract tags from refs
        var tags = tagRefs.split(EOL).map(function (ref) {
          var refIndex = ref.lastIndexOf('/') + 1;
          var refLength = ref.length - refIndex;
          return ref.substr(refIndex, refLength);
        });
        console.log(tags);
        // sort by semver, asc
        tags = tags.sort(semver.compare);
        // get the latest tag
        var latestTag = tags.pop();
        cb(err, latestTag);
      });
    }

    async.parallel([
      fetchLastVersion,
      fetchLatestTag
    ], function (err, results) {
      if (err) {
        return fail(err);
      }
      var last = results[0], latest = results[1];
      console.log('  > last: %s, latest: %s', (last || '(none)'), latest);

      if (semver.eq(last, latest)) {
        return fail('  > already have latest jsdoc3 build', 0);
      }

      if (semver.gt(last, latest)) {
        return fail('  > got previous version %s'.replace('%s', latest), 0);
      }

      console.log('  > using working version %s...', latest);
      config.WORKING_VERSION = latest;

      complete();
    });

  }, {async: true});

});