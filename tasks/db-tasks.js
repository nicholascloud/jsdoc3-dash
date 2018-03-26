'use strict';
const sqlite3 = require('sqlite3').verbose();
const rimraf = require('rimraf');
const async = require('async');
const fs = require('fs');
const path = require('path');
const DashRecord = require('./dash-record');
const config = require('./config');

namespace('db', function () {
  /**
   * Cleans sqlite database artifacts
   */
  task('clean', function () {
    console.log('cleaning database...');
    rimraf(config.DB_DEST_PATH, function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});

  /**
   * Creates sqlite database with appropriate schema and
   * writes all necessary database records
   */
  task('create', ['db:clean'], function () {
    console.log('creating database...');

    const INSERT_QUERY = 'INSERT INTO searchIndex (id, name, type, path) VALUES (?, ?, ?, ?)';

    const openConnection = function (callback) {
      console.log('  > opening connection...');
      const db = new sqlite3.Database(config.DB_DEST_PATH, function (err) {
        return callback(err, db);
      });
    };

    const createTable = function (db, callback) {
      console.log('  > creating table...');
      db.run('CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)', function (err) {
        callback(err, db);
      });
    };

    const _isHtmlFile = function (file) {
      return (/.*\.html$/ig).test(file);
    };

    const _makeDashRecord = function (file) {
      const relativePath = path.relative(config.DOCUMENTS_DIR, path.join(config.HTML_DIR, file));
      return new DashRecord(relativePath, file);
    };

    const createRecords = function (db, callback) {
      console.log('  > creating records...');
      let dashRecords = [];
      fs.readdir(config.HTML_DIR, function (err, files) {
        if (err) {
          return callback(err);
        }
        const htmlFiles = files.filter(_isHtmlFile);
        dashRecords = htmlFiles.map(_makeDashRecord);
        return callback(null, db, dashRecords);
      });
    };

    const writeRecords = function (db, dashRecords, callback) {
      console.log('  > writing records...', dashRecords.length);

      const inserts = [];
      dashRecords.map(function (record) {
        return record.toJSON();
      }).forEach(function (json) {
        inserts.push(function (asyncCallback) {
          db.run(INSERT_QUERY, [json.id, json.name, json.type, json.path], asyncCallback);
        });
      });

      async.series(inserts, function (err) {
        callback(err, db);
      });
    };

    async.waterfall([
      openConnection,
      createTable,
      createRecords,
      writeRecords
    ], function (err) {
      if (err) {
        return fail(err);
      }
      complete();
    });
  }, {async: true});
});