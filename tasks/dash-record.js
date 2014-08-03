'use strict';
var dashMap = require('./dash-map');

var currentKey = 0;

function toRecordType(fileName) {
  var fileType = fileName.substring(0, fileName.indexOf('-'));
  return dashMap.resolve(fileType);
}

function toEntityName(fileName) {
  var name = fileName.substring(
    fileName.indexOf('-') + 1,
    fileName.lastIndexOf('.')
  ).replace('-', ' ');
  var segments = name.split(' ');
  return segments.reduce(function (previous, current) {
    current = current.charAt(0).toUpperCase() +
      current.substr(1);
    return previous + ' ' + current;
  }, '');
}

function DashRecord(relativePath, fileName) {
  relativePath = relativePath || '';
  fileName = fileName || '';

  this.key = DashRecord._nextKey();
  this.relativePath = relativePath;
  this.recordType = toRecordType(fileName);
  this.name = toEntityName(fileName);
}

DashRecord._nextKey = function () {
  currentKey += 1;
  return currentKey;
};

DashRecord._resetKey = function () {
  currentKey = 0;
};

DashRecord.prototype.toJSON = function () {
  return {
    key: this.key,
    type: this.recordType,
    path: this.relativePath,
    name: this.name
  };
};

module.exports = DashRecord;