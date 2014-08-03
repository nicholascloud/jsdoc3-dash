'use strict';
var config = require('./config'),
  async = require('async'),
  rimraf = require('rimraf'),
  mkdirp = require('mkdirp');

desc('cleans build output');
task('clean', function () {
  console.log('cleaning build artifacts...');

  function removeTempDir(callback) {
    rimraf(config.BUILD_DIR, callback);
  }

  function removeBuildDir(callback) {
    rimraf(config.TMP_DIR, callback);
  }

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

  function createTempDir(callback) {
    mkdirp(config.TMP_DIR, callback);
  }

  function createBuildDir(callback) {
    //make path all the way to the HTML dir
    mkdirp(config.HTML_DIR, callback);
  }

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

var buildDeps = [
  'git:check',
  'clean',
  'scaffold',
  'git:clone',
  'version:increment',
  'fs:copy-docset',
  'fs:copy-plist',
  'fs:copy-icon',
  'fs:copy-readme',
  'fs:copy-json',
  'db:create',
  'archive',
  'feed:incversion',
  'version:commit'
];

desc('builds the docset');
task('build', buildDeps, function () {
  //intentionally empty
});