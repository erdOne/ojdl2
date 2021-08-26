const path = require("path");
const { readFileSync } = require("fs");
const { spawn } = require('child_process');

const gulp = require("gulp");
//const cache = require("gulp-cached");
//const uglify = require("gulp-uglify");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const babelrc = JSON.parse(readFileSync("./.babelrc"));

const paths = {
  // scripts: {
    entry: "./src/client/index.jsx",
    src: "./src/client",
    dest: "public/dist",
    destfilename: "index.js"
  // },
  // upload: ["public/**/*", "src/server/**/*", "src/common/*", "package*.json"]
};

function build() {
  const config = {
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
    entry: [paths.entry],
    output: {
      filename: paths.destfilename
    },
    optimization: {
      minimize: (process.env.NODE_ENV === "production"),
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            filename: `vendor.${paths.destfilename}`
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
  };
  return gulp.src(paths.src, { sourcemaps: true })
    .pipe(webpackStream(config, webpack))
  // .pipe(babel({
  //     presets: ["@babel/preset-env"],
  //     plugins: ["transform-react-jsx"]
  // }))
  //.pipe(uglify())
    .pipe(gulp.dest(paths.dest))
}

function watch() {
  console.log("Staring backend server...");
  const proc = spawn("node", ["-r", "esm", path.resolve(__dirname, "src/server/index.js")]);
  proc.stdout.on("data", x => process.stdout.write(x));
  proc.stderr.on("data", x => process.stderr.write(x));
  let executing = false;
  gulp.watch(paths.src).on("change", () => {
    if (executing)
      return;
    executing = true;
    build().on("end", () => { executing = false; });
  });
}

exports.watch = watch;
exports.build = build;
exports.default = build;
