'use strict';
const dashMap = {
  about: 'Guide',
  howto: 'Guide',
  plugins: 'Guide',
  tags: 'Tag',
  index: 'Guide'
};

const DEFAULT_TYPE = 'Guide';

module.exports = {
  /**
   * Resolves file prefixes to Dash types
   * @see http://kapeli.com/types/
   */
  resolve: function (fileType) {
    if (dashMap.hasOwnProperty(fileType)) {
      return dashMap[fileType];
    }
    return DEFAULT_TYPE;
  }
};