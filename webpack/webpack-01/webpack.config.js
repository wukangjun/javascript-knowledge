/*
 * @Author: wukangjun
 * @Date: 2020-09-13 21:43:10
 * @Description: write something
 */
const glob = require('glob')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader') 


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
  entry: './src/pages/home/index.vue',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
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
      {
        test: /\.css|less|scss$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            appendExtension: true
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}