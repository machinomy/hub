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

const env = new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  context: path.resolve(__dirname, 'src', 'frontend'),
  entry: './dashboard.tsx',
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
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              plugins: ['react-hot-loader/babel'],
            },
          },
          'ts-loader', // (or awesome-typescript-loader)
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
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
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new UglifyPlugin())
}
