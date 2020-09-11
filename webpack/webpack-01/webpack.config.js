const glob = require('glob')
const path = require('path')


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
  entry: entry,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: './markdown-loader.js'
      }
      // {
      //   test: /\.css|less|scss$/,
      //   use: [
      //     'style-loader',
      //     'css-loader'
      //   ]
      // },
      // {
      //   test: /\.vue$/,
      //   use: 'vue-loader'
      // }
    ]
  }
}