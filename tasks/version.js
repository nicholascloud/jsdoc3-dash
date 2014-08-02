'use strict';
var fs = require('fs'),
  semver = require('semver'),
  config = require('./config');

var NO_VERSION = '0.0.0';

var versions = [(fs.readFileSync(config.VERSION_FILE) || NO_VERSION).toString()];

module.exports = Object.create({
  length: versions.length,

  current: function (cb) {
    cb(null, versions[0]);
  },

  previous: function (cb) {
    cb(null, versions[1] || '');
  },

  inc: function (segment, cb) {
    segment = segment || 'patch';
    var nextVersion, err;
    try {
      nextVersion = semver.inc(this.current(), segment);
    } catch (e) {
      err = e;
    }
    if (err) {
      return cb(err);
    }
    versions.unshift(nextVersion);
    this.length = versions.length;
    cb(null, nextVersion);
  },

  commit: function (cb) {
    fs.writeFile(config.VERSION_FILE, this.current(), cb);
  }
});