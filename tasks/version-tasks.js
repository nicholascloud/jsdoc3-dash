'use strict';
var version = require('./version');

namespace('version', function () {
  task('increment', {async: true}, function () {
    console.log('incrementing version...');
    version.inc('patch', function (err) {
      complete(err);
    });
  });

  task('commit', {async: true}, function () {
    console.log('committing version...');
    version.commit(function (err) {
      complete(err);
    });
  });
});