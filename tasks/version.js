'use strict';
var fs = require('fs'),
  semver = require('semver'),
  config = require('./config');

var NO_VERSION = '0.0.0';

var versions = [(fs.readFileSync(config.VERSION_FILE) || NO_VERSION).toString()];

var api = module.exports = Object.create({
  MAJOR: 'major',
  PREMAJOR: 'premajor',
  MINOR: 'minor',
  PREMINOR: 'preminor',
  PATCH: 'patch',
  PREPATCH: 'prepatch',
  PRERELEASE: 'prerelease',

  length: versions.length,

  current: function () {
    return versions[0];
  },

  previous: function () {
    return versions[1] || '';
  },

  inc: function (release, cb) {
    release = release || api.PATCH;
    var nextVersion, err;
    try {
      nextVersion = semver.inc(this.current(), release);
    } catch (e) {
      console.error(e);
      err = e;
    }
    if (err) {
      return cb(err);
    }
    versions.unshift(nextVersion);
    console.log(versions);
    this.length = versions.length;
    cb(null, nextVersion);
  },

  commit: function (cb) {
    fs.writeFile(config.VERSION_FILE, this.current(), cb);
  }
});