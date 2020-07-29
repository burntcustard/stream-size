'use strict';
const filesize = require('filesize');
const gzipSize = require('gzip-size');
const log = require('fancy-log');
const Transform = require('stream').Transform;

module.exports = (options = {}, callback) => {
  function getSize(file) {
    let sizeString = filesize(file.contents.length, options);

    if (options.gzip) {
      let gzipped = filesize(gzipSize.sync(file.contents), options);
      sizeString += ` (gzipped: ${gzipped})`;
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
      if (file.isNull()) {
        return transformCallback(null, file);
      }

      if (file.isStream()) {
        getSize(file);
        return transformCallback(null, file);
      }

      if (file.isBuffer()) {
        getSize(file);
        return transformCallback(null, file);
      }
    }
  });
};
