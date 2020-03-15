var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var vuxLoader = require('vux-loader')
var webpack=require('webpack');
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let webpackConfig = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.ProvidePlugin({
    jQuery: "jquery",
    $: "jquery",
     "window.jQuery": "jquery"
  })
],
  entry: {
    app: ["babel-polyfill", "./src/main.js"]
  },
  externals: {
    "BMap": "BMap"
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'assets': resolve('src/assets'),
      'jquery':'jquery'
    }
  },
  module: {
    ...(config.dev.useEslint? [{
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [resolve('src'), resolve('test')],
      options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
      }
    }] : []),
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      // {
      //   test:/\.scss$/,
      //   use: [
      //       {
      //           loader: 'style-loader' // creates style nodes from JS strings
      //       },
      //       {
      //           loader: 'css-loader' // translates CSS into CommonJS
      //       },
      //       {
      //           loader: 'sass-loader' // compiles Sass to CSS
      //       }
      //   ]
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000000,
          name: utils.assetsPath('./fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
    'vux-ui',
    'progress-bar',
    {
      name: 'duplicate-style',
      options: {
        cssProcessorOptions : {
          safe: true,
          zindex: false,
          autoprefixer: {
            add: true,
            browsers: [
              'iOS >= 7',
              'Android >= 4.1'
            ]
          }
        }
      }
    }
  ]
})
