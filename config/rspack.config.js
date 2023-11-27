const path = require('path');
const rspack = require('@rspack/core');
const { DotenvPlugin } = require('rspack-plugin-dotenv');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const mode = isProd ? 'production' : 'development';

module.exports = {
  mode,
  devtool: isProd
    ? 'source-map'
    : 'cheap-source-map',
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: 'static/js/[name].[contenthash].js',
    chunkFilename: 'static/js/[name].[contenthash].chunk.js',
    cssFilename: 'static/css/[name].[contenthash].css',
    assetModuleFilename: 'static/media/[name].[contenthash][ext]',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
  },
  devServer: {
    port: 6420,
    open: true,
    historyApiFallback: true,
  },
  builtins: {
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
    new rspack.HtmlRspackPlugin({
      template: './public/index.html',
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html'],
          }
        },
      ],
    }),
    ...!isProd ? [
      new DotenvPlugin(),
      new ForkTsCheckerWebpackPlugin(),
    ] : [],
    ...isProd && process.env.SENTRY_AUTH_TOKEN ? [
      new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "tyro-technologies-limited",
        project: "web-app",
      }),
    ] : [],
    new rspack.DefinePlugin(isProd ? {
      'process.env.AG_GRID_KEY': `"${process.env.AG_GRID_KEY}"`,
      'process.env.FULL_CALENDAR_KEY': `"${process.env.FULL_CALENDAR_KEY}"`,
      'process.env.REACT_APP_GRAPHQL_API_URI': false,
    }: {}),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};