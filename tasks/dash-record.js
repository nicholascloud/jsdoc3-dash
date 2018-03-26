'use strict';
const dashMap = require('./dash-map');

let currentKey = 0;

const toRecordType = function (fileName) {
  const fileType = fileName.substring(0, fileName.indexOf('-'));
  return dashMap.resolve(fileType);
};

const toEntityName = function (fileName) {
  const name = fileName.substring(
    fileName.indexOf('-') + 1,
    fileName.lastIndexOf('.')
  ).replace('-', ' ');
  const segments = name.split(' ');
  return segments.reduce(function (previous, current) {
    current = current.charAt(0).toUpperCase() +
      current.substr(1);
    return previous + ' ' + current;
  }, '');
};

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