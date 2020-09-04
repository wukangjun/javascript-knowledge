## @babel/preset-env
安装
```
npm install @babel/core @babel/cli @babel/preset-env -D
```
`babel.config.js`配置
```
module.exports = {
  presets: [
    '@babel/preset-env'
  ]
}
```
执行命令
```
node_modules/.bin/babel src --out-dir dist
```
源码
```
const hello = () => {}

const p = new Promise()

const m = new Map()

class A {
  constructor() {}
}
```
转译结果
```
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hello = function hello() {};

var p = new Promise();
var m = new Map();

var A = function A() {
  _classCallCheck(this, A);
};
```

仔细看，你会发现目前只对语法进行了转译,所以接下来我们需要使用Polyfill或者babel-runtime进行功能上的填充

这个时候重新配置`babel.config.js`
```
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: {
          version: 3,
          proposals: true
        }
      }
    ]
  ]
}
```