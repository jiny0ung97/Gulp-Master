import gulp from "gulp";
import gulpPug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gulpImage from "gulp-image";
import gulpSass from "gulp-sass";
import gulpAutoprefixer from "gulp-autoprefixer";
import gulpCsso from "gulp-csso";
import gulpBro from "gulp-bro";
import babelify from "babelify";
import gulpGhPages from "gulp-gh-pages";

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
        watch: "src/scss/**/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js"
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
        .pipe(gulp.dest(routes.sass.dest));

const js = () =>
    gulp
    .src(routes.js.src)
    .pipe(gulpBro({
        transform: [
            babelify.configure({ presets: ['@babel/preset-env'] }),
            [ 'uglifyify', { global: true } ]
          ]
    }))
    .pipe(gulp.dest(routes.js.dest));

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


const ghPages = () => gulp.src("build/**/*").pipe(gulpGhPages());

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.sass.watch, sass);
    gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean]);
const assets = gulp.series([img, pug, sass, js]);
const postDev = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, postDev]);
export const deploy = gulp.series([build, ghPages]);