'use strict';
var exec = require('child_process').exec,
  config = require('./config'),
  async = require('async'),
  fs = require('fs');

namespace('git', function () {
  task('clone', {async: true}, function () {
    var CLONE_CMD = 'git clone ' + config.REPO_URL + ' ' + config.TMP_DIR;
    console.log('Cloning jsdoc3 repo...');
    console.log('  >', CLONE_CMD);
    exec(CLONE_CMD, function (err) {
      if (err) {
        console.error(err);
      }
      complete(err);
    });
  }, {async: true});

  task('check', {async: true}, function () {
    var REMOTE_HASH_CMD = 'git ls-remote %1 | awk \'/master/ {print $1}\'';
    console.log('Comparing latest hashes...');

    function fetchLastHash(cb) {
      fs.readFile(config.MASTER_HASH_FILE, function (err, buffer) {
        if (err) {
          console.warn(err);
        }
        // ignore errors; return empty string and we will just rebuild
        cb(null, (buffer || '').toString());
      });
    }

    function fetchLatestHash(cb) {
      var cmd = REMOTE_HASH_CMD.replace('%1', config.REPO_URL);
      console.log('  >', cmd);
      exec(cmd, function (err, stdout/*, stderr*/) {
        cb(err, (stdout || '').toString());
      });
    }

    async.parallel([
      fetchLastHash,
      fetchLatestHash
    ], function (err, results) {
      if (err) {
        console.log(err);
        return complete(err);
      }
      var last = results[0], latest = results[1];
      console.log('  > last: %s, latest: %s', (last || '(none)'), latest);

      if (last !== latest) {
        console.log('  > updating master hash file...');
        fs.writeFileSync(config.MASTER_HASH_FILE, latest);
      } else {
        fail('  > already have latest jsdoc3 build', 0);
      }
      complete();
    });

  }, {async: true});

});