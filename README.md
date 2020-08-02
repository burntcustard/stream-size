# gulp-vinyl-size

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-vinyl-size`

## Information

Log the size of individual files (Vinyl objects) in the stream. A more flexible alternative to [gulp-size](https://www.npmjs.com/package/gulp-size).

## Basic Usage

```js
const size = require('gulp-vinyl-size');

gulp.task('scripts', function() {
  return gulp
    .src('assets/scripts/*.js')
    .pipe(size())
    .pipe(gulp.dest('/dist/js/'));
});

// [13:01:44] main.js: 3.13 KB
// [13:01:45] demo.js: 1.09 KB
```

## `options`

### `gzip` (Default: `false`)

Additionally log gzipped-size.

```js
.pipe(size({gzip: true}})

// [12:32:22] main.js: 5.29 KB (2.18 KB gzipped) 
```

### filesize

All options get passed _directly_ to the size-prettifying package [filesize](https://www.npmjs.com/package/filesize) so that the output can be easily tweaked. See [their npm page](https://www.npmjs.com/package/filesize) for a full list of optional settings.

```js
.pipe(size({standard: 'iec', spacer: '|'}})

// [12:32:22] main.js: 5.29|KiB
```

### Callback function

This can be added to further customize the logging. E.g.

```js
.pipe(size({}, size => log(`Minified CSS: ${size}`)))

// [12:32:22] Minified CSS: 3.13 KB
}

The parameter of the callback is an object which outputs the full size string when used within a template literal, but it also contains the following properties:
- 'sizeString` - Size _with_ formatting, e.g. 'test.txt: 24 B' - The same as when the parameter is put directly into the callback.
- `size`       - Size _without_ formatting, e.g. '24 B' instead of 'test.txt: 24 B'
- `filename`   - `file.relative` of the vinyl, e.g. 'main.js'.
- `gzip`       - Gzipped size, which is _included even if the `gzip` option is false_

```js
const gulp = require('gulp');
const size = require('gulp-vinyl-size');
const c = require('ansi-colors');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');

function css() {
  return gulp
    .src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .on('data', () => log('CSS'))
    .pipe(size({}, info => log(`└ transpiled ${color.magenta(info)}`)))
    .pipe(purgecss({content: ['**/*.php']}))
    .pipe(size({}, info => log(`└ purged     ${color.magenta(info)}`)))
    .pipe(cleanCSS())
    .pipe(size({}, info => log(`└ minified   ${color.magenta(info.size)} ${color.gray(`(gzipped: ${info.gzip})`)}`)))
    .pipe(gulp.dest('dist/css'));
}

// [11:02:38] Starting 'css'...
// [11:02:39] CSS
// [11:02:39] └ transpiled 29.06 KB
// [11:02:40] └ purged     6.31 KB
// [11:02:40] └ minified   3.13 KB (gzipped: 1.04 KB)
```
