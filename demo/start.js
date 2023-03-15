/**
 * Copyright (c) 2018 The xterm.js authors. All rights reserved.
 * @license MIT
 *
 * This file is the entry point for browserify.
 */

const path = require('path');
const webpack = require('webpack');
const startServer = require('./server.js');
const webpackDev = require('./webpack.dev.js')

startServer();

const compiler = webpack(webpackDev);

compiler.watch({
  // Example watchOptions
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  // Print watch/build result here...
  console.log(stats.toString({
    colors: true
  }));
});
