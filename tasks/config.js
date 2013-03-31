'use strict';
var path = require('path');

var ROOT = path.join(__dirname, '..');

var REPO_URL = 'https://github.com/jsdoc3/jsdoc3.github.com.git';
var DOCSET_NAME = 'jsdoc3.docset';
var DB_NAME = 'docSet.dsidx';
var PLIST_NAME = 'Info.plist';
var ICON_NAME = 'icon.png';
var ARCHIVE_NAME = 'jsdoc3.tgz';

var TMP_DIR = path.join(ROOT, '.tmp');
var BUILD_DIR = path.join(ROOT, 'build');
var ASSETS_DIR = path.join(ROOT, 'assets');

//docset directory structure
//jsdoc3.docset/Contents/Resources/Documents
var DOCSET_DIR = path.join(BUILD_DIR, DOCSET_NAME);
var CONTENTS_DIR = path.join(DOCSET_DIR, 'Contents');
var RESOURCES_DIR = path.join(CONTENTS_DIR, 'Resources');
var DOCUMENTS_DIR = path.join(RESOURCES_DIR, 'Documents');
var HTML_DIR = path.join(DOCUMENTS_DIR, 'jsdoc3');

//source paths
var PLIST_SRC_PATH = path.join(ASSETS_DIR, PLIST_NAME);
var ICON_SRC_PATH = path.join(ASSETS_DIR, ICON_NAME);

//destionation paths
var PLIST_DEST_PATH = path.join(CONTENTS_DIR, PLIST_NAME);
var ICON_DEST_PATH = path.join(DOCSET_DIR, ICON_NAME);
var DB_DEST_PATH = path.join(RESOURCES_DIR, DB_NAME);
var ARCHIVE_DEST_PATH = path.join(BUILD_DIR, ARCHIVE_NAME);

module.exports = {
  REPO_URL: REPO_URL,

  //names
  DOCSET_NAME: DOCSET_NAME,
  DB_NAME: DB_NAME,
  PLIST_NAME: PLIST_NAME,
  ICON_NAME: ICON_NAME,

  //directories
  TMP_DIR: TMP_DIR,
  BUILD_DIR: BUILD_DIR,
  DOCSET_DIR: DOCSET_DIR,
  CONTENTS_DIR: CONTENTS_DIR,
  RESOURCE_DIR: RESOURCES_DIR,
  DOCUMENTS_DIR: DOCUMENTS_DIR,
  HTML_DIR: HTML_DIR,

  //source paths
  PLIST_SRC_PATH: PLIST_SRC_PATH,
  ICON_SRC_PATH: ICON_SRC_PATH,

  //dest paths
  DB_DEST_PATH: DB_DEST_PATH,
  PLIST_DEST_PATH: PLIST_DEST_PATH,
  ICON_DEST_PATH: ICON_DEST_PATH,
  ARCHIVE_DEST_PATH: ARCHIVE_DEST_PATH
};