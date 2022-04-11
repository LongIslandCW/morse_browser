const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/morse.js')
  },
  output: {
    filename: '[name][contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: '[name][ext]'
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname,'dist')
    },
    watchFiles: {
      paths: ['dist/index.html','src/template.html'],
      options: {
        usePolling: false,
      }
    },
    port: 3000,
    open: false,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin(
      {
        title: 'Morse Tool',
        filename: 'index.html',
        template: path.resolve(__dirname, 'src/template.html'),
        favicon: path.resolve(__dirname, 'src/assets/LongIslandCWClub-favicon-2.jpg')
      }
    ),
    new webpack.ProvidePlugin(
      {
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      }
    ),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/wordfiles/'), to: 'wordfiles' },
        { from: path.resolve(__dirname, 'src/wordfilesconfigs/'), to: 'wordfilesconfigs' },
        // { from: "other", to: "public" },
      ],

    }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new ESLintPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(js)$/,
        exclude: [/node_modules/],
        use: ['babel-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      string_decoder: require.resolve('string_decoder/'),
      timers: require.resolve('timers-browserify'),
      url: require.resolve('url/'),
      buffer: require.resolve('buffer/'),
      os: require.resolve('os-browserify'),

    }
  }
}
