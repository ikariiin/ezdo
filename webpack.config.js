const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  entry: [path.join(path.resolve(__dirname, 'src/frontend/'), 'mounter.tsx')],
  output: {
    filename: 'app.bundle.js',
    chunkFilename: 'chunk-[name].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(path.resolve(__dirname, 'src/frontend/'), 'index.html'),
      meta: {
        "og:app_id": "2612236785666240",
        "og:title": "EZDo - Task Management app for the modern web",
        "twitter:title": "EZDo - Task Management app for the modern web",
        "og:description": "EZDo is a task management app built for the modern web with special attention to UX and functionality.",
        "og:image": "/social-images/ezdo-social.png",
        "twitter:image:src": "/social-images/ezdo-social.png",
        "twitter:image:width": "1920",
        "twitter:image:height": "1080",
        "description": "EZDo is a task management app built for the modern web with special attention to UX and functionality.",
        "twitter:description": "EZDo is a task management app built for the modern web with special attention to UX and functionality.",
        "og:type": "website",
        "og:author": "Gourab Nag",
        "twitter:creator": "@SaitamaSama1337",
        "twitter:card": "summary_large_image",
        "theme": "#202020"
      }
    }),
    new WebpackPwaManifest({
      name: "EZDo - Manage your tasks",
      short_name: "EZDo",
      "theme-color": "#EB5757",
      display: "standalone",
      background_color: "#151515",
      description: "Task management app",
      icons: [
        {
          src: path.resolve(path.join(__dirname + '/src/resources/icons/ezdo_icon_192.png')),
          size: '192x192'
        }
      ]
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, "src/resources/social-images"), to: "social-images" }
      ]
    })
    // new SocialTags({
    //   appUrl: 'https://ligma.tech',
    //   facebook: {
    //     'fb:app_id': "2612236785666240",
    //     'og:url': "https://ligma.tech",
    //     'og:type': "website",
    //     'og:title': "EZDo",
    //     'og:image': './src/resources/screenshots/ezdo-social.png',
    //     'og:description': "A task management app for the modern web. Manage your tasks through a carefully designed UX and focusing simplicity.",
    //     'og:site_name': "EZDo - A task management app for the modern web",
    //     'og:locale': "en_IN",
    //   },
    //   twitter: {
    //     "twitter:card": "summary",
    //     "twitter:site": "@ezdotasks",
    //     "twitter:creator": "@SaitamaSama1337",
    //     "twitter:url": "https://ligma.tech",
    //     "twitter:title": "EZDo",
    //     "twitter:description": "A task management app for the modern web. Manage your tasks through a carefully designed UX and focusing simplicity.",
    //     "twitter:image": './src/resources/screenshots/ezdo-social.png'
    //   },
    // })
  ],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      },
      {
        test: /\.css$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'resources/fonts/'
          }
        }]
      },
      {
        test: /\.(png|jpeg|jpg|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'resources/images/'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devServer: {
    historyApiFallback: true,
  },
  mode: process.env.APP_MODE
};
