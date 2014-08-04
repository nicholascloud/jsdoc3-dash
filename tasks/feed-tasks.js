'use strict';
var xml2js = require('xml2js'),
  fs = require('fs'),
  async = require('async'),
  version = require('./version'),
  config = require('./config');

namespace('feed', function () {
  /**
   * Increments the feed version and writes a new feed XML file
   */
  task('incversion', ['version:increment'], function () {
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