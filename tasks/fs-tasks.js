'use strict';
var fs = require('fs'),
  path = require('path'),
  os = require('os'),
  ncp = require('ncp').ncp,
  async = require('async'),
  version = require('./version'),
  config = require('./config');

namespace('fs', function () {
  /**
   * Copy the docset files to build output
   */
  task('copy-docset', function () {
    console.log('copying docset files...');

    var copyFilters = [
      /.+\.html$/,
      /.*lib$/,
      /.*styles$/
    ];

    function includeInDocset(file) {
      return copyFilters.some(function (filter) {
        return filter.test(file);
      });
    }

    function src(file) {
      return path.join(config.TMP_DIR, file);
    }

    function dest(file) {
      return path.join(config.HTML_DIR, file);
    }

    function copyDocsetFiles(files, callback) {
      var errors = [];
      files.forEach(function (file) {
        ncp(src(file), dest(file), function (err) {
          errors.push(err);
        });
      });
      if (errors.length > 0) {
        return callback(errors.join(os.EOL));
      }
      return callback(null);
    }

    fs.readdir(config.TMP_DIR, function (err, files) {
      if (err) {
        return complete(err);
      }

      var docsetFiles = files.filter(includeInDocset);

      copyDocsetFiles(docsetFiles, function (err) {
        if (err) {
          return fail(err);
        }
        complete();
      });
    });
  }, {async: true});

  /**
   * Copy the plist file to build output
   */
  task('copy-plist', function () {
    console.log('copying plist file...');
    ncp(config.PLIST_SRC_PATH, config.PLIST_DEST_PATH, function (err) {
      if (err) {
        return fail(err);
      }
      complete()
    });
  }, {async: true});

  /**
   * Copy the icons to build output
   */
  task('copy-icon', function () {
    console.log('copying icon file...');

    function copyIcon(src, dest) {
      return function (cb) {
        console.info('  > copying', src, dest);
        ncp(src, dest, cb);
      };
    }

    async.parallel([
      copyIcon(config.ICON16_SRC_PATH, config.ICON16_DEST_PATH),
      copyIcon(config.ICON32_SRC_PATH, config.ICON32_DEST_PATH)
    ], function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});

  /**
   * Copy the README to build output
   */
  task('copy-readme', function () {
    console.log('copying readme...');
    ncp(config.README_SRC_PATH, config.README_DEST_PATH, function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});

  /**
   * Copy the docset JSON file to build output
   */
  task('copy-json', ['version:increment'], function () {
    console.log('copying docset json...');

    function readJSON(cb) {
      console.info('  > reading', config.JSON_SRC_PATH);
      fs.readFile(config.JSON_SRC_PATH, function (err, buffer) {
        if (err) {
          return cb(err);
        }
        var json;
        try {
          json = JSON.parse(buffer.toString());
        } catch (e) {
          err = e;
        }
        cb(err, json);
      });
    }

    function writeJSON(json, cb) {
      var err;
      try {
        var content = JSON.stringify(json, null, '  ');
      } catch (e) {
        err = e;
      }
      if (err) {
        return cb(err);
      }

      console.log('  > writing', config.JSON_DEST_PATH);

      fs.writeFile(config.JSON_DEST_PATH, content, function (err) {
        cb(err);
      });
    }

    function versionJSON(json, cb) {
      json.version = version.current();
      cb(null, json);
    }

    async.waterfall([
      readJSON,
      versionJSON,
      writeJSON
    ], function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});
});