import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from "webpack";
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export default {
  mode: 'development',
  entry: './examples/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist-examples'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        monaco: {
          test: /[\\/]node_modules[\\/]@monaco-editor[\\/]/,
          name: 'monaco',
          chunks: 'all',
          priority: 20,
        },
        snowflake: {
          test: /[\\/]node_modules[\\/]snowflake-sql-validator[\\/]/,
          name: 'snowflake',
          chunks: 'all',
          priority: 20,
        },
        headlessui: {
          test: /[\\/]node_modules[\\/]@headlessui[\\/]/,
          name: 'headlessui',
          chunks: 'all',
          priority: 20,
        },
        reactSelect: {
          test: /[\\/]node_modules[\\/]react-select[\\/]/,
          name: 'react-select',
          chunks: 'all',
          priority: 20,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'process/browser': require.resolve('process/browser.js')
    },
    fallback: {
      "process": require.resolve("process/browser.js"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.webpack.json'
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/index.html',
      filename: 'index.html',
    }),
    new MonacoWebpackPlugin({
      languages: ['sql'],
      features: [
        'bracketMatching',
        'clipboard',
        'find',
        'wordHighlighter'
      ]
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist-examples'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  devtool: 'eval-cheap-module-source-map',
  performance: {
    hints: 'warning',
    maxEntrypointSize: 250000,
    maxAssetSize: 250000,
  },
};
