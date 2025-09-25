import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export default {
  mode: 'development',
  entry: './examples/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist-examples'),
    filename: 'bundle.js',
    clean: true,
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
  devtool: 'inline-source-map',
};
