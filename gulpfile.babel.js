const gulp = require("gulp");
//const cache = require("gulp-cached");
const gutil = require("gutil");
//const uglify = require("gulp-uglify");
const webpack = require("webpack");
const gwebpack = x => require("webpack-stream")(x, webpack);
const ftp = require("vinyl-ftp");
//const { ftpServer } = require("./secrets.js");
var HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const path = require("path");

const { readFileSync } = require("fs");
const babelrc = JSON.parse(readFileSync("./.babelrc"));

function shouldLog(type, val) {
  return (type.indexOf("UP") === -1 || val.indexOf("100%") !== -1);
}

function getFtpConnection() {
  return ftp.create({
    ...ftpServer,
    log: (...x)=> shouldLog(...x) && gutil.log(...x)
  });
}

const paths = {
  scripts: {
    main: "./src/client/index.jsx",
    src: "./src/client",
    dest: "public/dist",
    destfilename: "index.js"
  },
  upload: ["public/**/*", "src/server/**/*", "src/common/*", "package*.json"]
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */

/*
 * Define our tasks using plain functions
 */

function scripts() {
  if (scripts.executing) return gulp.src(".");
  scripts.executing = true;
  return gulp.src(paths.scripts.src, {
    sourcemaps: true
  })
    .pipe(gwebpack({
      module: {
        rules: [{
          test: /\.jsx?$/,
          loader: "babel-loader",
          query: babelrc
        }, {
          test: /\.s?css$/,
          use: [
            "style-loader",
            "css-loader"
          ]
        }]
      },
      mode: "development",
      // mode: "production",
      plugins: [
        new webpack.ProvidePlugin({
          "React": "react",
          "ReactDOM": "react-dom"
        }),
        new HardSourceWebpackPlugin()
      ],
      entry: [paths.scripts.main],
      output: {
        filename: paths.scripts.destfilename
      },
      optimization: {
        minimize: false
      },
      resolve: {
        modules: ["node_modules"],
        alias: {
            common: path.resolve(__dirname, "./src/common"),
            client: path.resolve(__dirname, "./src/client")
        }
      }
    }))
  // .pipe(babel({
  //     presets: ["@babel/preset-env"],
  //     plugins: ['transform-react-jsx']
  // }))
  //.pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .on("end", ()=>{ scripts.executing = false; });
}

function upload(x) {
  var conn = getFtpConnection();
  return gulp.src(x, { base: ".", buffer: false })
    .pipe(conn.dest("/home/erd1/ojdl2"));
}

function watch() {
  //paths.destfiles.map(watchUpload);
  gulp.watch(paths.scripts.src).on("change", x => {
    try {
      scripts(x);
    } catch (e) { console.error(e); }
  });
  gulp.watch(paths.upload).on("change", upload);
}


exports.scripts = scripts;
exports.watch = watch;
exports.default = scripts;
exports.upload = () => upload("public/dist/index.js");
exports.uploadServer = () => upload("public/dist/server/**/*");
