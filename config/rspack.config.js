const path = require('path');
const Dotenv = require('rspack-plugin-dotenv');
// const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd
    ? 'source-map'
    : false,
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: 'static/js/[contenthash].js',
    chunkFilename: 'static/js/[contenthash].chunk.js',
    cssFilename: 'static/css/[contenthash].css',
    assetModuleFilename: 'static/media/[contenthash][ext]',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
  },
  devServer: {
    port: 6420,
    open: true,
    historyApiFallback: true,
  },
  builtins: {
    html: [
      {
        template: './public/index.html',
      },
    ],
    copy: {
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html'],
          }
        },
        {
          from: 'public/locales',
          to: 'locales/[path][name].[contenthash][ext]'
        }
      ],
    },
    emotion: true,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              typescript: true,
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash].[ext]',
            },
          },
        ],
        issuer: {
          and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
        },
      },
      {
        test: /public\/locales\/[\w]+\/[\w]+\.json$/,
        type: 'asset/resource',
        exclude: /node_modules/,
        generator: {
          filename: '[path][name].[contenthash][ext]',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router|@mui)[\\/]/,
          priority: 50,
          enforce: true,
        },
        table: {
          chunks: 'all',
          name: 'table',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](@ag-grid-community|@ag-grid-enterprise)[\\/]/,
          priority: 40,
          enforce: true,
        },
        calendar: {
          chunks: 'all',
          name: 'calendar',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](@fullcalendar)[\\/]/,
          priority: 30,
          enforce: true,
        },
        charts: {
          chunks: 'all',
          name: 'charts',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](apexcharts|react-apexcharts)[\\/]/,
          priority: 20,
          enforce: true,
        },
        graphiqlEditor: {
          chunks: 'all',
          name: 'graphiql',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](graphiql)[\\/]/,
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new Dotenv(),
    ...!isProd ? [
      new ForkTsCheckerWebpackPlugin(),
    ] : [],
    // ...isProd ? [
    //   sentryWebpackPlugin({
    //     authToken: process.env.SENTRY_AUTH_TOKEN,
    //     org: "tyro-technologies-limited",
    //     project: "web-app",
    //   }),
    // ] : [],
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};