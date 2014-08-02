'use strict';
var xml2js = require('xml2js'),
  fs = require('fs'),
  path = require('path'),
  domain = require('domain'),
  async = require('async'),
  semver = require('semver'),
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
  fs.readFile(config.FEED_FILE, function (err, buffer) {
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
  fs.writeFile(config.FEED_FILE, xml, function (err) {
    cb(err);
  });
}

function incVersion(json, cb) {
  var version, err;
  try {
    version = json.entry.version[0];
    version = semver.inc(version, 'patch');
    json.entry.version[0] = version;
  } catch (e) {
    err = e;
  }
  cb(err, json);
}

function archiveFeed(json, cb) {
  var version, err;
  try {
    version = json.entry.version[0];
  } catch (e) {
    err = e;
  }
  if (err) {
    return cb(err);
  }
  var fileName = ['jsdoc3-', version, '.xml'].join('');
  var feedDir = path.dirname(config.FEED_FILE);
  var archivePath = path.join(feedDir, fileName);
  console.log(archivePath);

  var d = domain.create();
  d.on('error', cb);
  d.run(function () {
    fs.createReadStream(config.FEED_FILE)
      .pipe(fs.createWriteStream(archivePath))
      .on('close', cb);
  });
}

namespace('feed', function () {
  task('incversion', ['feed:archive'], {async: true}, function () {
    console.log('incrementing feed version...');
    async.waterfall([
      readFeed,
      incVersion,
      writeFeed
    ], function (err) {
      complete(err);
    });
  });

  task('archive', {async: true}, function () {
    console.log('archiving feed...');
    async.waterfall([
      readFeed,
      archiveFeed
    ], function (err) {
      complete(err);
    });
  });
});