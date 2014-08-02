'use strict';
var fs = require('fs'),
  path = require('path'),
  os = require('os'),
  ncp = require('ncp').ncp,
  async = require('async'),
  xml2js = require('xml2js'),
  version = require('./version'),
  config = require('./config');

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

function copyIcon(src, dest) {
  return function (cb) {
    ncp(src, dest, cb);
  };
}

var parser = new xml2js.Parser(),
  builder = new xml2js.Builder();

function readJSON(cb) {
  /*

   */
  fs.readFile(config.JSON_SRC_PATH, function (err, buffer) {
    if (err) {
      return cb(err);
    }

    parser.parseString(buffer.toString(), function (err, json) {
      if (err) {
        return cb(err);
      }
      console.log(json);
      cb(null, json);
    });
  });
}

function writeJSON(json, cb) {
  /*

   */
  var xml, err;
  try {
    xml = builder.buildObject(json);
  } catch (e) {
    err = e;
  }
  if (err) {
    return cb(err);
  }
  console.log(xml);
  cb(null);
//  fs.writeFile(config.JSON_DEST_PATH, xml, function (err) {
//    cb(err);
//  });
}

function incVersion(json, cb) {
  version.current(function (err, ver) {
    if (err) {
      return cb(err);
    }
    try {
      //json.entry.version[0] = ver;
    } catch (e) {
      err = e;
    }
    cb(err, json);
  });
}

namespace('fs', function () {
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
    async.parallel([
      copyIcon(config.ICON16_SRC_PATH, config.ICON16_DEST_PATH),
      copyIcon(config.ICON32_SRC_PATH, config.ICON32_DEST_PATH)
    ], function (err) {
      complete(err);
    });
  }, {async: true});

  task('copy-readme', function () {
    console.log('Copying readme...');
    ncp(config.README_SRC_PATH, config.README_DEST_PATH, function (err) {
      complete(err);
    });
  }, {async: true});

  task('copy-json', ['version:increment'], function () {
    console.log('Copying docset json...');
    async.waterfall([
      readJSON,
      incVersion,
      writeJSON
    ], function (err) {
      complete(err);
    });
  }, {async: true});
});