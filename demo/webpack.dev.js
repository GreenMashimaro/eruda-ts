/**
 * This webpack config builds and watches the demo project. It works by taking the output from tsc
 * (via `yarn watch`) which is put into `out/` and then webpacks it into `demo/dist/`. The aliases
 * are used fix up the absolute paths output by tsc (because of `baseUrl` and `paths` in
 * `tsconfig.json`.
 *
 * For production builds see `webpack.config.js` in the root directory. If that is built the demo
 * can use that by switching out which `Terminal` is imported in `client.ts`, this is useful for
 * validating that the packaged version works correctly.
 */
const autoprefixer = require('autoprefixer')
const prefixer = require('postcss-prefixer')
const clean = require('postcss-clean')
const path = require('path')

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      prefixer({
        prefix: '_',
        ignore: [/luna-*/],
      }),
      autoprefixer,
      clean(),
    ],
  },
}

module.exports = {
  entry: path.resolve(__dirname, 'client.ts'),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['css-loader', postcssLoader, 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['css-loader', postcssLoader],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '..')],
    alias: {
      '@': path.resolve(__dirname, '..', 'out/src/'),
      chobitsu: path.resolve(__dirname, '..', 'out/src/chobitsu/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      // The ligature modules contains fallbacks for node environments, we never want to browserify them
      stream: false,
      util: false,
      os: false,
      path: false,
      fs: false,
    },
  },
  output: {
    filename: 'client-bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  watch: true,
}
