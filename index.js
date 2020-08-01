'use strict';
const filesize = require('filesize');
const gzipSize = require('gzip-size');
const log = require('fancy-log');
const { Transform } = require('stream');
const Vinyl = require('vinyl');

module.exports = (options = {}, callback) => {
  function formatSize(size) {
    if (options.bytes) {
      return size += ' B';
    } else {
      return filesize(size, options);
    }
  }

  function getSize(file) {
    let sizeString = formatSize(
      file.contents ? file.contents.length : file.length
    );

    if (options.gzip) {
      let gzippedString = formatSize(gzipSize.sync(file.contents));
      sizeString += ` (gzipped: ${gzippedString})`;
    }

    if (callback instanceof Function) {
      callback(sizeString);
    } else {
      log(`${file.relative ? file.relative + ':' : ''} ${sizeString}`);
    }
  }

  return new Transform({
    objectMode: true,
    transform: function(file, encoding, transformCallback) {
      // If being called with a Vinyl (probably via Gulp)
      if (Vinyl.isVinyl(file)) {
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

      if (Buffer.isBuffer(file)) {
        console.log('buffer');
        getSize(file);
        return transformCallback(null, file);
      }

      console.log('something else');
      getSize(file);
      return transformCallback(null, file);
    }
  });
};
