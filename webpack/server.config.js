const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const loaders = require("./loaders");
const fs = require("fs");
const CircularDependencyPlugin = require("circular-dependency-plugin");

var HappyPack = require("happypack");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const os = require("os");

const lambdaDir = path.join(__dirname, "../modules/server");

/** A map of of entry points for every file in scripts */
const lambdaEntry = fs
  .readdirSync(lambdaDir)
  .filter(f => /\.tsx?$/.test(f))
  .filter(f => fs.statSync(path.join(lambdaDir, f)).isFile())
  .reduce((o, f) => {
    o[`lambda/${f.replace(/\.tsx?$/, "")}`] = path.resolve(
      path.join(lambdaDir, f)
    );
    return o;
  }, {});

// const scriptsDir = path.join(__dirname, "../entry/scripts");

/** A map of of entry points for every file in scripts */
// const scriptEntry = fs
//   .readdirSync(scriptsDir)
//   .filter(f => /\.tsx?$/.test(f))
//   .filter(f => fs.statSync(path.join(scriptsDir, f)).isFile())
//   .reduce((o, f) => {
//     o[`scripts/${f.replace(/\.tsx?$/, "")}`] = path.resolve(
//       path.join(scriptsDir, f)
//     );
//     return o;
//   }, {});

const entry = Object.assign(
  // {
  //   server: "./entry/server.ts",
  // },
  // scriptEntry,
  lambdaEntry
);
console.info(entry);

module.exports = {
  entry: entry,
  // Never minify the server
  mode: "development",
  target: "node",

  //devtool: "source-map",
  devtool: "inline-source-map",
  optimization: {
    // Don't turn process.env.NODE_ENV into a compile-time constant
    nodeEnv: false,
  },
  context: `${__dirname}/../`,

  target: "node",
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    libraryTarget: "commonjs2",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "../modules"), "node_modules"],
  },

  externals: [
    nodeExternals({
      whitelist: [/^lodash-es/],
    }),
  ],
  module: {
    rules: [loaders.typescript],
  },

  // https://github.com/TypeStrong/ts-loader#transpileonly-boolean-defaultfalseO
  stats: {
    warningsFilter: /export .* was not found in/,
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),

    new webpack.DefinePlugin({
      __TEST__: "false",
      __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
    }),

    ...(process.env.ANALYZE
      ? [new (require("webpack-bundle-analyzer")).BundleAnalyzerPlugin()]
      : []),

    // new webpack.debug.ProfilingPlugin({
    //   outputPath: "server-build.json"
    // }),

    // new HappyPack({
    //   id: "ts",pu
    //   threads: process.env.CI ? 1 : Math.max(1, os.cpus().length / 2 - 1),
    //   loaders: [
    //     {
    //       path: "ts-loader",
    //       query: { happyPackMode: true, configFile: "tsconfig.json" },
    //     },
    //   ],
    // }),
    new ForkTsCheckerWebpackPlugin({
      // https://github.com/Realytics/fork-ts-checker-webpack-plugin#options
      useTypescriptIncrementalApi: true,
    }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      include: /modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
  ],
};
