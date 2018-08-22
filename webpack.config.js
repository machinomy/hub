const path = require('path')
const SVGO = require('svgo')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const htmlConfig = new HtmlPlugin({
  title: 'Machinomy Hub',
  filename: 'index.html'
})

const copyConfig = new CopyPlugin([{
  context: 'assets',
  from: '**/*.!(svg)',
  to: 'assets'
}])

const svgo = new SVGO()
const svgCopyConfig = new CopyPlugin([{
  context: 'frontend/assets',
  from: '**/*.svg',
  to: 'assets',
  transform: (content, path) => svgo.optimize(content, {path})
}])

const env = new webpack.EnvironmentPlugin({ NODE_ENV: 'development', HUB_URL: null })

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  context: path.resolve(__dirname, 'src', 'frontend'),
  entry: './dashboard.ts',
  output: {
    path: path.resolve(__dirname, 'dist', 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          'ts-loader', // (or awesome-typescript-loader)
        ],
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss']
  },

  plugins: [
    htmlConfig,
    svgCopyConfig,
    copyConfig,
    env,
  ],

  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'cheap-module-source-map',

  watchOptions: {
    ignored: /node_modules|dist/
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    fs: 'empty'
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new UglifyPlugin())
}
