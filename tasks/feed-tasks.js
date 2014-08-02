'use strict';
var xml2js = require('xml2js'),
  fs = require('fs'),
  path = require('path'),
  async = require('async'),
  ncp = require('ncp').ncp,
  version = require('./version'),
  config = require('./config');

var parser = new xml2js.Parser(),
  builder = new xml2js.Builder();

function readFeed(cb) {
  /*
  { entry:
    { version: [ 'x.y.z' ],
    url: [ 'https://raw.github.com/nicholascloud/jsdoc3-dash/master/build/jsdoc3.tgz' ] }
  }
  */
  fs.readFile(config.FEED_SRC_PATH, function (err, buffer) {
    if (err) {
      return cb(err);
    }

    parser.parseString(buffer.toString(), function (err, json) {
      if (err) {
        return cb(err);
      }
      cb(null, json);
    });
  });
}

function writeFeed(json, cb) {
  /*
   <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
   <entry>
    <version>x.y.z</version>
    <url>https://raw.github.com/nicholascloud/jsdoc3-dash/master/build/jsdoc3.tgz</url>
   </entry>
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
  fs.writeFile(config.FEED_DEST_PATH, xml, function (err) {
    cb(err);
  });
}

function incVersion(json, cb) {
  version.current(function (err, ver) {
    if (err) {
      return cb(err);
    }
    try {
      json.entry.version[0] = ver;
    } catch (e) {
      err = e;
    }
    cb(err, json);
  });
}

namespace('feed', function () {
  task('archive', ['version:increment'], {async: true}, function () {
    console.log('archiving feed...');
    if (!fs.existsSync(config.FEED_DEST_PATH)) {
      return complete();
    }
    version.previous(function (err, ver) {
      if (err) {
        return complete(err);
      }

      var fileName = ['jsdoc3-', ver, '.xml'].join('');
      var archivePath = path.join(config.FEED_DIR, fileName);

      ncp(config.FEED_DEST_PATH, archivePath, function (err) {
        complete(err);
      });
    });
  });

  task('incversion', ['feed:archive', 'version:increment'], {async: true}, function () {
    console.log('incrementing feed version...');
    async.waterfall([
      readFeed,
      incVersion,
      writeFeed
    ], function (err) {
      complete(err);
    });
  });
});