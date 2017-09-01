var gulp = require('gulp')
	, sass = require('gulp-sass')
	, browserSync = require('browser-sync').create()
	, sourcemaps = require('gulp-sourcemaps')
	, uglify = require('gulp-uglify')
	, rename = require('gulp-rename')
;

gulp.task('watch', ['browserSync', 'sass', 'build-js'], function(){
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('src/**/*.js', ['build-js']); 
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
		//.pipe(sourcemaps.init())
		// .pipe(concat('bundle.js'))
		//only uglify if gulp is ran with '--type production'
		.pipe(uglify())
		//.pipe(sourcemaps.write())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/'));
});