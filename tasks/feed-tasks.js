'use strict';
var xml2js = require('xml2js'),
  fs = require('fs'),
  path = require('path'),
  async = require('async'),
  ncp = require('ncp').ncp,
  version = require('./version'),
  config = require('./config');

namespace('feed', function () {
  /**
   * Archives the existing feed file
   */
  task('archive', ['version:increment'], function () {
    console.log('archiving feed...');

    if (!fs.existsSync(config.FEED_DEST_PATH)) {
      return complete();
    }

    var fileName = ['jsdoc3-', version.previous() || 'x.x.x', '.xml'].join('');
    var archivePath = path.join(config.FEED_DIR, fileName);

    console.info('  > writing', archivePath);

    ncp(config.FEED_DEST_PATH, archivePath, function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});

  /**
   * Increments the feed version and writes a new feed XML file
   */
  task('incversion', ['version:increment', 'feed:archive'], function () {
    console.log('incrementing feed version...');

    var parser = new xml2js.Parser(),
      builder = new xml2js.Builder();

    function readFeed(cb) {
      /*
       { entry:
       { version: [ 'x.y.z' ],
       url: [ 'https://raw.github.com/nicholascloud/jsdoc3-dash/master/build/jsdoc3.tgz' ] }
       }
       */
      console.info('  > reading', config.FEED_SRC_PATH);

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

      console.info('  > writing', config.FEED_DEST_PATH);

      fs.writeFile(config.FEED_DEST_PATH, xml, function (err) {
        cb(err);
      });
    }

    function incVersion(json, cb) {
      var err;
      try {
        json.entry.version[0] = version.current();
      } catch (e) {
        err = e;
      }
      cb(err, json);
    }

    async.waterfall([
      readFeed,
      incVersion,
      writeFeed
    ], function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});
});