var gulp = require('gulp')
	, sass = require('gulp-sass')
	, browserSync = require('browser-sync').create()
	, sourcemaps = require('gulp-sourcemaps')
	, uglify = require('gulp-uglify')
	, rename = require('gulp-rename')
	, jsdoc = require('gulp-jsdoc3')
;

gulp.task('watch', ['browserSync', 'sass', 'doc', 'build-js'], function(){
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('src/**/*.js', ['doc', 'build-js']);
	// Other watchers
})

gulp.task('sass', function(){
	return gulp.src('scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: ''
		},
	})
})

gulp.task('build-js', function() {
	return gulp.src('src/**/*.js')
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('doc', function (cb) {
	var config = require('./jsdoc.json');
	gulp.src(['README.md', 'src/**/*.js'], {read: false})
		.pipe(jsdoc(config, cb));
});
