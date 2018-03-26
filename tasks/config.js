'use strict';
const path = require('path'),
  fs = require('fs');

const ROOT = path.join(__dirname, '..');

const REPO_URL = 'https://github.com/jsdoc3/jsdoc3.github.com.git';
const DOCSET_NAME = 'jsdoc.docset';
const DB_NAME = 'docSet.dsidx';
const PLIST_NAME = 'Info.plist';
const ICON16_NAME = 'icon.png';
const ICON32_NAME = 'icon@2x.png';
const ARCHIVE_NAME = 'JSDoc.tgz';
const FEED_FILE = path.join(ROOT, 'feeds', 'JSDoc.xml');
const VERSION_FILE = path.join(ROOT, 'version.semver');

const TMP_DIR = path.join(ROOT, '.tmp');
const BUILD_DIR = path.join(ROOT, 'build');
const ASSETS_DIR = path.join(ROOT, 'assets');

//docset directory structure
//jsdoc.docset/Contents/Resources/Documents
const DOCSET_DIR = path.join(BUILD_DIR, DOCSET_NAME);
const CONTENTS_DIR = path.join(DOCSET_DIR, 'Contents');
const RESOURCES_DIR = path.join(CONTENTS_DIR, 'Resources');
const DOCUMENTS_DIR = path.join(RESOURCES_DIR, 'Documents');
const HTML_DIR = path.join(DOCUMENTS_DIR, 'jsdoc');
const FEED_DIR = path.join(ROOT, 'feeds');

//source paths
const PLIST_SRC_PATH = path.join(ASSETS_DIR, PLIST_NAME);
const ICON16_SRC_PATH = path.join(ASSETS_DIR, ICON16_NAME);
const ICON32_SRC_PATH = path.join(ASSETS_DIR, ICON32_NAME);
const README_SRC_PATH = path.join(ASSETS_DIR, 'README.md');
const JSON_SRC_PATH = path.join(ASSETS_DIR, 'docset.json');
const FEED_SRC_PATH = path.join(ASSETS_DIR, 'JSDoc.xml');

//destination paths
const PLIST_DEST_PATH = path.join(CONTENTS_DIR, PLIST_NAME);
const ICON16_DEST_PATH = path.join(DOCSET_DIR, ICON16_NAME);
const ICON32_DEST_PATH = path.join(DOCSET_DIR, ICON32_NAME);
const DB_DEST_PATH = path.join(RESOURCES_DIR, DB_NAME);
const ARCHIVE_DEST_PATH = path.join(BUILD_DIR, ARCHIVE_NAME);
const README_DEST_PATH = path.join(DOCSET_DIR, 'README.md');
const JSON_DEST_PATH = path.join(DOCSET_DIR, 'docset.json');
const FEED_DEST_PATH = path.join(FEED_DIR, 'JSDoc.xml');

module.exports = {
  WORKING_VERSION: fs.readFileSync(VERSION_FILE).toString().trim(),

  REPO_URL: REPO_URL,
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