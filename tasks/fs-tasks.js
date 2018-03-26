'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const ncp = require('ncp').ncp;
const async = require('async');
const config = require('./config');

namespace('fs', function () {
  /**
   * Copy the docset files to build output
   */
  task('copy-docset', function () {
    console.log('copying docset files...');

    const copyFilters = [
      /.+\.html$/,
      /.*lib$/,
      /.*styles$/
    ];

    const includeInDocset = function (file) {
      return copyFilters.some(function (filter) {
        return filter.test(file);
      });
    };

    const src = function (file) {
      return path.join(config.TMP_DIR, file);
    };

    const dest = function (file) {
      return path.join(config.HTML_DIR, file);
    };

    const copyDocsetFiles = function (files, callback) {
      const errors = [];
      files.forEach(function (file) {
        ncp(src(file), dest(file), function (err) {
          errors.push(err);
        });
      });
      if (errors.length > 0) {
        return callback(errors.join(os.EOL));
      }
      return callback(null);
    };

    fs.readdir(config.TMP_DIR, function (err, files) {
      if (err) {
        return complete(err);
      }

      const docsetFiles = files.filter(includeInDocset);

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
      complete();
    });
  }, {async: true});

  /**
   * Copy the icons to build output
   */
  task('copy-icon', function () {
    console.log('copying icon file...');

    const copyIcon = function (src, dest) {
      return function (cb) {
        console.info('  > copying', src, dest);
        ncp(src, dest, cb);
      };
    };

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
  task('copy-json', function () {
    console.log('copying docset json...');

    const readJSON = function (cb) {
      console.info('  > reading', config.JSON_SRC_PATH);
      fs.readFile(config.JSON_SRC_PATH, function (err, buffer) {
        if (err) {
          return cb(err);
        }
        let json;
        try {
          json = JSON.parse(buffer.toString());
        } catch (e) {
          err = e;
        }
        cb(err, json);
      });
    };

    const writeJSON = function (json, cb) {
      let err, content;
      try {
        content = JSON.stringify(json, null, '  ');
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
    };

    const versionJSON = function (json, cb) {
      json.version = config.WORKING_VERSION;
      cb(null, json);
    };

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