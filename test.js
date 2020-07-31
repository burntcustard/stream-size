var assert = require('assert');
//var es = require('event-stream');
var File = require('vinyl');
var streamSize = require('.');
var stdout = require("test-console").stdout;
var gulp = require('gulp');
var vfs = require('vinyl-fs');
var fs = require('fs');
var sinon = require('sinon');
const log = require('fancy-log');

describe('stream-size', function() {
  it('should do something', function() {

    const stub = sinon.stub(log);

    console.log(stub);
    stub.calledWith('test');

    function test() {
      return gulp
        .src('test.txt')
        .pipe(streamSize())
        .pipe(gulp.dest('test-output'));
    }

    gulp.series(test);

    //assert.deepEqual(stub.calledWith('test'), ['7 B']);
  });
});
