'use strict'
const path = require( 'path' );
const webpack = require( 'webpack' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const VueLoaderPlugin = require( 'vue-loader/lib/plugin' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const OptimizeCSSAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: devMode ? 'development' : 'production',
  performance: devMode ? {} : {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 4024000
  },
  entry: {
    entry: './src/entry.js',
    entry: './src/sass/entry.scss',
  },
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: devMode ? '[name].bundle.js' : '[name].[hash].bundle.js'
  },
  module: {
    rules: [
      {
        // enforce: 'pre'を指定することによって
        // enforce: 'pre'がついていないローダーより早く処理が実行される
        // 今回はbabel-loaderで変換する前にコードを検証したいため、指定が必要
        "enforce": "pre",
        "test": /\.(js)$/,
        "exclude": /node_modules/,
        "use": "eslint-loader"
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader!eslint-loader'
          },
          loaders: {
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
        }
      },
      {
        // ローダーの処理対象ファイル
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        use: [
          {
            // 利用するローダー
            loader: 'babel-loader',
            // ローダーのオプション
            // 今回はbabel-loaderを利用しているため
            // babelのオプションを指定しているという認識で問題ない
            options: {
              presets: [ [ '@babel/preset-env', { modules: false } ] ]
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // publicPath: path.resolve( __dirname, '../app/assets/stylesheets' ),
              // only enable hot in development
              hmr: process.env.NODE_ENV === 'development',
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            }
          },
          // 'vue-style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'images',
          publicPath: 'images' // Use this for .erb and change to '../images/fantas' for mock
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin( {
      'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV )
    } ),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin( {
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].bundle.css' : '[name].[hash].bundle.css',
      chunkFilename: devMode ? '[id].bundle.css' : '[id].[hash].bundle.css',
      // filename: 'stylesheets/[name].bundle.css'
    } ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  devtool: devMode ? 'inline-source-map' : false,
  // devtool: devMode ? 'inline-source-map' : 'none',
  // devServer: devMode ? {
  //   contentBase: '../app/assets',
  //   hot: true,
  //   inline: true,
  //   host: 'localhost'
  // } : {},
  optimization: devMode ? {} : {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TerserPlugin( {
        extractComments: 'all',
        terserOptions: {
          compress: {
            drop_console: true,
          }
        }
      } )
    ],
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: [ '*', '.js', '.scss', '.vue', '.json' ]
  }
};
