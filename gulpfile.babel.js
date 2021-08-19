const gulp = require("gulp");
//const cache = require("gulp-cached");
//const uglify = require("gulp-uglify");
const webpack = require("webpack");
const gwebpack = x => require("webpack-stream")(x, webpack);
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const path = require("path");
const { readFileSync } = require("fs");

const babelrc = JSON.parse(readFileSync("./.babelrc"));

const paths = {
  scripts: {
    main: "./src/client/index.jsx",
    src: "./src/client",
    dest: "public/dist",
    destfilename: "index.js"
  },
  upload: ["public/**/*", "src/server/**/*", "src/common/*", "package*.json"]
};

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
      mode: (process.env.NODE_ENV === "production" ? "production" : "development"),
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
        minimize: true,
        splitChunks: {
          cacheGroups: {
            vendors: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
            },
          },
        },
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

function watch() {
  //paths.destfiles.map(watchUpload);
  gulp.watch(paths.scripts.src).on("change", x => {
    try {
      scripts(x);
    } catch (e) {
      console.error(e);
    }
  });
  // gulp.watch(paths.upload).on("change", upload);
}

exports.scripts = scripts;
exports.watch = watch;
exports.default = scripts;
