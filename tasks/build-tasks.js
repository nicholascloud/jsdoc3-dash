/*global namespace, task, desc, complete*/
'use strict';
var config = require('./config'),
  fs = require('fs'),
  path = require('path'),
  exec = require('child_process').exec,
  sql = require('sqlite3').verbose(),
  async = require('async'),
  rimraf = require('rimraf'),
  mkdirp = require('mkdirp');

function removeTempDir(callback) {
  rimraf(config.BUILD_DIR, callback);
}

function removeBuildDir(callback) {
  rimraf(config.TMP_DIR, callback);
}

desc('cleans build output');
task('clean', {async: true}, function () {
  console.log('Cleaning build artifacts...');
  async.parallel([
    removeTempDir,
    removeBuildDir
  ], function (err) {
    if (err) {
      console.error(err);
    }
    complete(err);
  });
});

function createTempDir(callback) {
  mkdirp(config.TMP_DIR, callback);
}

function createBuildDir(callback) {
  mkdirp(config.DOCUMENTS_DIR, callback);
}

task('scaffold', {async: true}, function () {
  console.log('Scaffolding build directories...');
  async.parallel([
    createTempDir,
    createBuildDir
  ], function (err) {
    if (err) {
      console.error(err);
    }
    complete(err);
  });
});

var buildDeps = [
  'clean',
  'scaffold',
  'git:clone',
  'fs:copy-docset',
  'fs:copy-plist',
  'fs:copy-icon',
  'db:create',
  'archive'
];

desc('builds the docset');
task('build', buildDeps, function () {
  //intentionally empty
});