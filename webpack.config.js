'use strict';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const env = require('yargs').argv.build;

const configEnvVals = {};
configEnvVals.cssModuleLoaderLocalIndent = 'css?modules&importLoaders=1!postcss!sass';

//always present, environment based config vals
if (env === 'dev') {
  console.log('\x1b[34m%s\x1b[0m', '----- Building Publishing-UI in DEV -----');
  configEnvVals.babelCacheDir = true;
  configEnvVals.textLoaderTest = 'url';
  configEnvVals.cssModuleLoaderLocalIndent = 'style!css?modules&importLoaders=1&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss!sass';
} else {
  console.log('\x1b[32m%s\x1b[0m', '----- Building Publishing-UI in PROD -----');
  configEnvVals.textLoaderTest = 'file-loader?name=assets/[name]-[hash].[ext]';
  configEnvVals.babelCacheDir = false;
}

//base webpack config
let config = {
  entry: [
    path.join(__dirname, '/app/scripts/main.js')
  ],
  output: {
    path: __dirname + '/lib',
    publicPath: '/',
    filename: 'flowtest.js'
  },
  resolve: {
    root: [
      path.join(__dirname, '/app/scripts')
    ],
    fallback: [
      path.join(__dirname, '/node_modules')
    ],
    alias: {
      'styles': path.join(__dirname, '/app/styles'),
      'scripts': path.join(__dirname, '/app/scripts'),
      'images': path.join(__dirname, '/app/images')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'transform-runtime',
            'transform-decorators-legacy',
            'lodash'
          ]
        },
        cacheDirectory: configEnvVals.babelCacheDir
      },
      {
        test: /\.scss$/,
        exclude: [
          path.join(__dirname, 'app/styles/modules')
        ],
        loader: 'style!css!postcss!sass'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.scss$/,
        include: [
          path.join(__dirname, 'app/styles/modules')
        ],
        loader: configEnvVals.cssModuleLoaderLocalIndent
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg|png|gif|jpg)$/,
        loader: configEnvVals.textLoaderTest
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  postcss: function() {
    return [autoprefixer({
      browsers: [
        'last 3 versions',
        '> 1%',
        'ie >= 10'
      ],
      cascade: false
    })];
  }
};

//environment based config plugins
if (env === 'dev') {
  config.module.devtool = 'source-map';
  config.module.loaders[0].query.plugins.push(new webpack.NoErrorsPlugin());
  if (process.env.HOT) {
    config.module.loaders[0].query.plugins.push(['react-transform', {
      'transforms': [{
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
      }, {
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      }]
    }]);
  }
} else {
  config.module.loaders[0].query.plugins.push('transform-react-constant-elements');
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      drop_console: true
    }
  }));
  config.plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/));
  config.plugins.push(new webpack.optimize.DedupePlugin());
}

module.exports = config;
