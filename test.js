var assert = require('assert');
//var es = require('event-stream');
var File = require('vinyl');
var size = require('.');
var stdout = require("test-console").stdout;
var gulp = require('gulp');
var vfs = require('vinyl-fs');

describe('stream-size', function() {
  it('should do something', function() {

    // create the fake file
    var fakeFile = new File({
      path: 'test-path',
      cwd: __dirname,
      base: 'test-base',
      contents: new Buffer.from('this is 21 characters'),
    });

    var output = stdout.inspectSync(function() {
      //console.log(JSON.stringify(fakeFile.contents));

      var log = function(file, cb) {
        //console.log(file.path);
        console.log(file);
        cb(null, file);
      };

      //fakeFile.contents.pipe(size());
      vfs
        .src('./*.txt')
        .pipe(log)
        .pipe(size())
        .pipe(vfs.dest('./output'));
    });

    assert.deepEqual(output, ['21 B']);
  });
});
