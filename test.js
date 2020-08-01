const streamSize = require('.');
const gulp = require('gulp');
const Vinyl = require('vinyl');
//const { Readable } = require('stream');
const fs = require('fs');

describe('stream-size', () => {
  it('should work with gulp and a real file', (done) => {
    const stdoutSpy = jest.spyOn(process.stdout, 'write');
    gulp
      .src('test.txt')
      .pipe(streamSize())
      .pipe(gulp.dest('./'))
      .on('end', () => {
        expect(stdoutSpy).lastCalledWith(
          expect.stringContaining('test.txt: 27 B'),
          expect.anything()
        );
        done();
      });
  });

  it('should work with a Vinyl', (done) => {
    const stdoutSpy = jest.spyOn(process.stdout, 'write');
    const stream = streamSize();

    stream.write(new Vinyl({
      path: 'example.js',
      contents: Buffer.alloc(1234)
    }));

    stream.on('data', () => {});

    stream.on('end', () => {
      expect(stdoutSpy).lastCalledWith(
        expect.stringContaining('example.js: 1.21 KB'),
        expect.anything()
      );
      done();
    });

    stream.end();
  });

  it('should work with plain Node streams', (done) => {
    const stdoutSpy = jest.spyOn(process.stdout, 'write');
    const stream = fs.createReadStream('test.txt');

    stream.on('open', () => {
      stream.pipe(streamSize());
      stream.destroy();
    });

    stream.on('data', () => {});

    stream.on('end', () => {
      expect(stdoutSpy).lastCalledWith(
        expect.stringContaining('example.js: 1.21 KB'),
        expect.anything()
      );
      done();
    });

    stream.end();
  });
});
