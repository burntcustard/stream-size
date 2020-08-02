const gulp = require('gulp');
const streamSize = require('.');
const Vinyl = require('vinyl');
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

  it('should work with a Vinyl', done => {
    const stream = streamSize();

    stream.write(new Vinyl({
      path: 'example.js',
      contents: Buffer.alloc(1234)
    }));

    stream.on('finish', () => {
      expect(stdoutSpy).lastCalledWith(
        expect.stringContaining('example.js: 1.21 KB'),
        expect.anything()
      );
      done();
    });

    stream.end();
  });

  it('should print out gzipped size with gzip: true', done => {
    const stream = streamSize({gzip: true});

    stream.write(new Vinyl({
      path: 'example.js',
      contents: Buffer.alloc(1234)
    }));

    stream.on('finish', () => {
      expect(stdoutSpy).lastCalledWith(
        expect.stringContaining('example.js: 1.21 KB (gzipped: 30 B)'),
        expect.anything()
      );
      done();
    });

    stream.end();
  });

  it('should pass options to the filesize package', done => {
    const stream = streamSize({standard: 'iec'});

    stream.write(new Vinyl({
      path: 'example.js',
      contents: Buffer.alloc(1234)
    }));

    stream.on('finish', () => {
      expect(stdoutSpy).lastCalledWith(
        expect.stringContaining('example.js: 1.21 KiB'),
        expect.anything()
      );
      done();
    });

    stream.end();
  });

  it('should run the callback function with it\'s parameter', done => {
    const stream = streamSize({}, size => process.stdout.write(`${size}`));

    stream.write(new Vinyl({
      path: 'example.js',
      contents: Buffer.alloc(1234)
    }));

    stream.on('finish', () => {
      expect(stdoutSpy).lastCalledWith('1.21 KB');
      done();
    });

    stream.end();
  });

  it('should have filename, size, gzip props on the callback param', done => {
    const stream = streamSize({}, info => process.stdout.write(
      `${info.filename}: ${info.size} (gzipped: ${info.gzip})`
    ));

    stream.write(new Vinyl({
      path: 'example.js',
      contents: Buffer.alloc(1234)
    }));

    stream.on('finish', () => {
      expect(stdoutSpy).lastCalledWith('example.js: 1.21 KB (gzipped: 30 B)');
      done();
    });

    stream.end();
  });
});
