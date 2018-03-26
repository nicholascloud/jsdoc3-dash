'use strict';
const config = require('./config');
const async = require('async');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

desc('cleans build output');
task('clean', function () {
  console.log('cleaning build artifacts...');

  const removeTempDir = function (callback) {
    rimraf(config.DOCSET_DIR, callback);
  };

  const removeBuildDir = function (callback) {
    rimraf(config.TMP_DIR, callback);
  };

  async.parallel([
    removeTempDir,
    removeBuildDir
  ], function (err) {
    if (err) {
      return fail(err);
    }
    complete();
  });
}, {async: true});

/**
 * Creates build directories
 */
task('scaffold', function () {
  console.log('scaffolding build directories...');

  const createTempDir = function (callback) {
    mkdirp(config.TMP_DIR, callback);
  };

  const createBuildDir = function (callback) {
    //make path all the way to the HTML dir
    mkdirp(config.HTML_DIR, callback);
  };

  async.parallel([
    createTempDir,
    createBuildDir
  ], function (err) {
    if (err) {
      return fail(err);
    }
    complete();
  });
}, {async: true});

const buildDeps = [
  'git:check',
  'clean',
  'scaffold',
  'git:clone',
  'git:checkout',
  'fs:copy-docset',
  'fs:copy-plist',
  'fs:copy-icon',
  'fs:copy-readme',
  'fs:copy-json',
  'db:create',
  'compress',
  'feed:version',
  'version:commit'
];

desc('builds the docset');
task('build', buildDeps, function () {
  //intentionally empty
});