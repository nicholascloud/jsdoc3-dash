/*global namespace, task, desc, complete*/
'use strict';

var fs = require('fs'),
  path = require('path'),
  os = require('os'),
  ncp = require('ncp').ncp,
  config = require('./config');

namespace('fs', function () {

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

  task('copy-docset', function () {
    console.log('Copying docset files...');
    fs.readdir(config.TMP_DIR, function (err, files) {
      if (err) {
        return complete(err);
      }

      var docsetFiles = files.filter(includeInDocset);

      copyDocsetFiles(docsetFiles, function (err) {
        return complete(err);
      });
    });
  }, {async: true});

  task('copy-plist', function () {
    console.log('Copying plist file...');
    ncp(config.PLIST_SRC_PATH, config.PLIST_DEST_PATH, function (err) {
      complete(err);
    });
  }, {async: true});

  task('copy-icon', function () {
    console.log('Copying icon file...');
    ncp(config.ICON_SRC_PATH, config.ICON_DEST_PATH, function (err) {
      complete(err);
    });
  }, {async: true});
});