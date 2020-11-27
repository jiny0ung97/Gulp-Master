import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gulpImage from "gulp-image";
import gulpSass from "gulp-sass";
import gulpAutoprefixer from "gulp-autoprefixer";
import gulpCsso from "gulp-csso";

gulpSass.compiler = require("node-sass");

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    sass: {
        watch: "src/scss/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css"
    }
};

// prepare
const clean = () => del(["build"]);

//assets
const img = () => 
    gulp
        .src(routes.img.src)
        .pipe(gulpImage())
        .pipe(gulp.dest(routes.img.dest));

const pug = () => 
    gulp
        .src(routes.pug.src)
        .pipe(gulpPug())
        .pipe(gulp.dest(routes.pug.dest));

const sass = () => 
    gulp
        .src(routes.sass.src)
        .pipe(gulpSass().on("error", gulpSass.logError))
        .pipe(
            gulpAutoprefixer({
                overrideBrowserslist: ["last 2 versions"]
            })
        )
        .pipe(gulpCsso())
        .pipe(gulp.dest(routes.sass.dest))


//postDev
const webserver = () => 
    gulp
        .src("build")
        .pipe(
            ws({
                livereload: true,
                open: true
            })
        );

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.sass.watch, sass);
}

const prepare = gulp.series([clean]);
const assets = gulp.series([img, pug, sass]);
const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);