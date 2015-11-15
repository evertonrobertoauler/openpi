var webpack = require('webpack');
var path = require('path');

var defineObj = {
  ON_DEVELOPMENT: process.env.NODE_ENV === 'development',
  ON_PRODUCTION: process.env.NODE_ENV === 'production'
};

var plugins = [
  new webpack.DefinePlugin(defineObj),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /pt-br/),
  new webpack.NoErrorsPlugin()
];

if (defineObj.ON_PRODUCTION) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {warnings: false},
    output: {comments: false}
  }));
}

module.exports = {
  context: path.join(__dirname, 'app', 'src'),
  entry: './index.ts',
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  output: {
    path: path.join(__dirname, 'app', 'www'),
    filename: 'bundle.js',
    publicPath: 'www/'
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader!tslint', exclude: /node_modules/},
      {test: /\.css/, loader: defineObj.ON_PRODUCTION ? "style!css?minimize" : "style!css"},
      {test: /\.html/, loader: "html"},
      {test: /\.png/, loader: "file?name=img/[name].[ext]"},
      {test: /\.(woff|ttf|eot|svg)/, loader: 'file?name=fonts/[name].[ext]'}
    ]
  },
  debug: !defineObj.ON_PRODUCTION,
  devtool: '#source-map',
  watchOptions: {
    aggregateTimeout: 200
  },
  plugins: plugins
};
