var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task('compile', function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

gulp.task('watch', function () {
    gulp.watch(['*.ts'], gulp.series(['compile']));
});

gulp.task('default', gulp.series(['compile', 'watch']));