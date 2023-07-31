const path = require('path');
const Dotenv = require('rspack-plugin-dotenv');
const minifyPlugin = require('@rspack/plugin-minify');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? "production" : "development",
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: 'static/js/[name].[contenthash].js',
    chunkFilename: 'static/js/[name].[contenthash].chunk.js',
    cssFilename: 'static/css/[name].[contenthash].css',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    path: path.resolve(__dirname, '../dist'),
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
        // {
        //   from: 'public/locales',
        //   to: 'locales/[path][name].[contenthash][ext]'
        // }
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
      // {
      //   test: /public\/locales\/[\w]+\/[\w]+\.json$/,
      //   type: 'asset/resource',
      //   exclude: /node_modules/,
      //   generator: {
      //     filename: '[path][name].[contenthash][ext]',
      //   },
      // },
    ],
  },
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    //   maxSize: 100000,
    // },
    // ...(isProd ? {
    //   minimize: true,
    //   minimizer: [
    //     new minifyPlugin({
    //       minifier: 'terser',
    //     }),
    //   ],
    // } : {}),
  },
  plugins: [
    new Dotenv(),
  ],
};