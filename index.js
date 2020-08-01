'use strict';
const { Transform } = require('stream');
const filesize = require('filesize');
const gzipSize = require('gzip-size');
const log = require('fancy-log');

module.exports = (options = {}, callback) => {
  function formatSize(size) {
    if (options.bytes) {
      return size += ' B';
    } else {
      return filesize(size, options);
    }
  }

  function getSize(file) {
    let sizeString = formatSize(file.contents.length);

    if (options.gzip) {
      let gzippedString = formatSize(gzipSize.sync(file.contents));
      sizeString += ` (gzipped: ${gzippedString})`;
    }

    if (callback instanceof Function) {
      callback(sizeString);
    } else {
      log(`${file.relative}: ${sizeString}`);
    }
  }

  return new Transform({
    objectMode: true,
    transform: function(file, encoding, transformCallback) {
      if (file.isStream() || file.isBuffer()) {
        getSize(file);
      }

      return transformCallback(null, file);
    }
  });
};
