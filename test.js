//const { Readable } = require('stream');
const gulp = require('gulp');
const streamSize = require('.');
const Vinyl = require('vinyl');
const fs = require('fs');
let stdoutSpy;

beforeEach(() => {
  stdoutSpy = jest.spyOn(process.stdout, 'write');
});

afterEach(() => {
  stdoutSpy.mockRestore();
});

describe('stream-size', () => {
  it('should work with gulp and a real file', (done) => {

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
    const stream = fs.createReadStream('test.txt');

    stream.pipe(streamSize());

    stream.on('end', () => {
      expect(stdoutSpy).lastCalledWith(
        expect.stringContaining('example.js: 1.21 KB'),
        expect.anything()
      );
      done();
    });

    stream.on('open', () => {
    });

    // stream.on('data', () => {});
    //
    // stream.on('end', () => {
    //   expect(stdoutSpy).lastCalledWith(
    //     expect.stringContaining('example.js: 1.21 KB'),
    //     expect.anything()
    //   );
    //   done();
    // });
    //
    // stream.end();
  });
});
