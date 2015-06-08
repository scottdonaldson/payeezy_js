// ----- Gulp
var gulp = require('gulp'),
    uglify = require('gulp-uglify');

// ----- Source files
var src = './javascript/src/**/*',
    dest = './javascript/min';

gulp.task('uglify', function() {
    gulp.src(src)
        .pipe(uglify())
        .pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
    gulp.watch(src, ['uglify']);
});

gulp.task('default', ['uglify', 'watch']);
