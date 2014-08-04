'use strict';
var path = require('path');

var ROOT = path.join(__dirname, '..');

var REPO_URL = 'https://github.com/jsdoc3/jsdoc3.github.com.git';
var DOCSET_NAME = 'jsdoc.docset';
var DB_NAME = 'docSet.dsidx';
var PLIST_NAME = 'Info.plist';
var ICON16_NAME = 'icon.png';
var ICON32_NAME = 'icon@2x.png';
var ARCHIVE_NAME = 'jsdoc.tgz';
var MASTER_HASH_FILE = path.join(ROOT, 'master.hash');
var FEED_FILE = path.join(ROOT, 'feeds', 'jsdoc3.xml');
var VERSION_FILE = path.join(ROOT, 'version.semver');

var TMP_DIR = path.join(ROOT, '.tmp');
var BUILD_DIR = path.join(ROOT, 'build');
var ASSETS_DIR = path.join(ROOT, 'assets');

//docset directory structure
//jsdoc.docset/Contents/Resources/Documents
var DOCSET_DIR = path.join(BUILD_DIR, DOCSET_NAME);
var CONTENTS_DIR = path.join(DOCSET_DIR, 'Contents');
var RESOURCES_DIR = path.join(CONTENTS_DIR, 'Resources');
var DOCUMENTS_DIR = path.join(RESOURCES_DIR, 'Documents');
var HTML_DIR = path.join(DOCUMENTS_DIR, 'jsdoc');
var FEED_DIR = path.join(ROOT, 'feeds');

//source paths
var PLIST_SRC_PATH = path.join(ASSETS_DIR, PLIST_NAME);
var ICON16_SRC_PATH = path.join(ASSETS_DIR, ICON16_NAME);
var ICON32_SRC_PATH = path.join(ASSETS_DIR, ICON32_NAME);
var README_SRC_PATH = path.join(ASSETS_DIR, 'README.md');
var JSON_SRC_PATH = path.join(ASSETS_DIR, 'docset.json');
var FEED_SRC_PATH = path.join(ASSETS_DIR, 'jsdoc3.xml');

//destination paths
var PLIST_DEST_PATH = path.join(CONTENTS_DIR, PLIST_NAME);
var ICON16_DEST_PATH = path.join(DOCSET_DIR, ICON16_NAME);
var ICON32_DEST_PATH = path.join(DOCSET_DIR, ICON32_NAME);
var DB_DEST_PATH = path.join(RESOURCES_DIR, DB_NAME);
var ARCHIVE_DEST_PATH = path.join(BUILD_DIR, ARCHIVE_NAME);
var README_DEST_PATH = path.join(DOCSET_DIR, 'README.md');
var JSON_DEST_PATH = path.join(DOCSET_DIR, 'docset.json');
var FEED_DEST_PATH = path.join(FEED_DIR, 'jsdoc3.xml');

module.exports = {
  REPO_URL: REPO_URL,
  MASTER_HASH_FILE: MASTER_HASH_FILE,
  VERSION_FILE: VERSION_FILE,
  FEED_FILE: FEED_FILE,

  //names
  DOCSET_NAME: DOCSET_NAME,
  DB_NAME: DB_NAME,
  PLIST_NAME: PLIST_NAME,
  ICON16_NAME: ICON16_NAME,
  ICON32_NAME: ICON32_NAME,

  //directories
  TMP_DIR: TMP_DIR,
  BUILD_DIR: BUILD_DIR,
  DOCSET_DIR: DOCSET_DIR,
  CONTENTS_DIR: CONTENTS_DIR,
  RESOURCE_DIR: RESOURCES_DIR,
  DOCUMENTS_DIR: DOCUMENTS_DIR,
  HTML_DIR: HTML_DIR,
  FEED_DIR: FEED_DIR,

  //source paths
  PLIST_SRC_PATH: PLIST_SRC_PATH,
  ICON16_SRC_PATH: ICON16_SRC_PATH,
  ICON32_SRC_PATH: ICON32_SRC_PATH,
  README_SRC_PATH: README_SRC_PATH,
  JSON_SRC_PATH: JSON_SRC_PATH,
  FEED_SRC_PATH: FEED_SRC_PATH,

  //dest paths
  DB_DEST_PATH: DB_DEST_PATH,
  ARCHIVE_DEST_PATH: ARCHIVE_DEST_PATH,
  PLIST_DEST_PATH: PLIST_DEST_PATH,
  ICON16_DEST_PATH: ICON16_DEST_PATH,
  ICON32_DEST_PATH: ICON32_DEST_PATH,
  README_DEST_PATH: README_DEST_PATH,
  JSON_DEST_PATH: JSON_DEST_PATH,
  FEED_DEST_PATH: FEED_DEST_PATH
};