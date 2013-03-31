/*global namespace, task, desc, complete*/
'use strict';

var sqlite3 = require('sqlite3').verbose(),
  rimraf = require('rimraf'),
  async = require('async'),
  fs = require('fs'),
  path = require('path'),
  DashRecord = require('./dash-record'),
  config = require('./config');

var INSERT_QUERY = 'INSERT INTO searchIndex (id, name, type, path) VALUES (?, ?, ?, ?)';

namespace('db', function () {
  task('clean', function () {
    console.log('Cleaning database...');
    rimraf(config.DB_DEST_PATH, function (err) {
      complete(err);
    });
  }, {async: true});

  function openConnection(callback) {
    console.log('  > opening connection...');
    var db = new sqlite3.Database(config.DB_DEST_PATH, function (err) {
      return callback(err, db);
    });
  }

  function createTable(db, callback) {
    console.log('  > creating table...');
    db.run('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)', function (err) {
      callback(err, db);
    });
  }

  function _isHtmlFile(file) {
    return (/.*\.html$/ig).test(file);
  }

  function _makeDashRecord(file) {
    var relativePath = path.relative(config.DOCUMENTS_DIR, path.join(config.HTML_DIR, file));
    return new DashRecord(relativePath, file);
  }

  function createRecords(db, callback) {
    console.log('  > creating records...');
    var dashRecords = [];
    fs.readdir(config.HTML_DIR, function (err, files) {
      if (err) {
        return callback(err);
      }
      var htmlFiles = files.filter(_isHtmlFile);
      dashRecords = htmlFiles.map(_makeDashRecord);
      return callback(null, db, dashRecords);
    });
  }

  function writeRecords(db, dashRecords, callback) {
    console.log('  > writing records...', dashRecords.length);

    var inserts = [];
    dashRecords.map(function (record) {
      return record.toJSON();
    }).forEach(function (json) {
      inserts.push(function (asyncCallback) {
        db.run(INSERT_QUERY, [json.id, json.name, json.type, json.path], asyncCallback);
      });
    });

    async.series(inserts, function (err) {
      if (err) {
        console.error(err);
      }
      callback(err, db);
    });
  }

  task('create', ['db:clean'], function () {
    console.log('Creating database...');
    async.waterfall([
      openConnection,
      createTable,
      createRecords,
      writeRecords
    ], function (err) {
      if (err) {
        console.error(err);
      }
      complete(err);
    });
  }, {async: true});
});