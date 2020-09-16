/*
 * @Author: wukangjun
 * @Date: 2020-09-13 21:43:10
 * @Description: write something
 */
const glob = require('glob')
const path = require('path')
const { VueLoaderPlugin } = require('@auxiliary/wv-loader')


const targets = glob.sync('./src/**/*.vue')

const entry = {};
targets.forEach(target => {
  t = target
    .replace(/^.\/src/, '')
    .replace(/.vue$/, '')

  entry[t] = target
})

// 获取目录下所有的prefix的目录数组

module.exports = {
  mode: 'none',
  entry,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: '@auxiliary/wv-loader'
      },
      {
        test: /\.css|less|scss$/,
        use: [
          'css-loader'
        ]
      }
      // {
      //   test: /\.vue$/,
      //   use: {
      //     loader: './markdown-loader.js',
      //     options: {
      //       appendExtension: true
      //     }
      //   }
      // },
      // {
      //   test: /\.html$/,
      //   use: 'html-loader'
      // }
      // {
      //   test: /\.css|less|scss$/,
      //   use: [
      //     'style-loader',
      //     'css-loader'
      //   ]
      // },
      // {
      //   test: /\.vue$/,
      //   use: {
      //     loader: 'vue-loader',
      //     options: {
      //       appendExtension: true
      //     }
      //   }
      // }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}