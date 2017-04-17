var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var CopyWebpackPlugin  = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/index.jsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".jsx", ".js", ".css", ".scss", ".html"]
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.jsx?$/, loader: "msx-loader" },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      { test: /\.txt$/,   loader: 'raw-loader' },
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000&name=[name].[ext]' }
    ],

    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      //{ test: /\.js$/, loader: "source-map-loader" }
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  plugins: [
    new CopyWebpackPlugin([ 
      // static assets
      { from: 'src/assets', to: 'assets' }
    ]),
    // generating html
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // grabbing js libraries from the node_modules folder
    new ProvidePlugin({
      m: 'mithril',
      moment: 'moment/moment.js',
      '_' : "lodash",
      PouchDB: "pouchdb",
      Mith: "./util/Mith",
      anime: "animejs"
    })
  ]
};
