import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gulpImage from "gulp-image";

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    }
};

// prepare
const clean = () => {
    return del(["build"]);
}

//assets
const img = () => {
    return gulp.src(routes.img.src).pipe(gulpImage()).pipe(gulp.dest(routes.img.dest));
}
const pug = () => {
    return gulp.src(routes.pug.src).pipe(gulpPug()).pipe(gulp.dest(routes.pug.dest));
}

//postDev
const webserver = () => {
    return gulp.src("build").pipe(ws({livereload: true, open: true}));
}
const watch = () => {
    gulp.watch(routes.pug.watch, pug);
}

const prepare = gulp.series([clean]);
const assets = gulp.series([img, pug]);
const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);