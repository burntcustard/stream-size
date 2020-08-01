const streamSize = require('.');
const gulp = require('gulp');
const stdoutSpy = jest.spyOn(process.stdout, 'write');

describe('stream-size', () => {
  it('should work with gulp', (done) => {
    gulp
      .src('test.txt')
      .pipe(streamSize())
      .pipe(gulp.dest('./'))
      .on('end', function() {
        expect(stdoutSpy).lastCalledWith(
          expect.stringContaining('test.txt: 27 B'),
          expect.anything()
        );
        done();
      });
  });
});
