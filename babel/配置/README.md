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
        useBuiltIns: 'entry', //usage
        corejs: {
          version: 3,
          proposals: true
        }
      }
    ]
  ]
}
```

### useBuiltIns: entry 配置方式

源码
```
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const hello = () => {}

const p = new Promise()

const m = new Map()

class A {
  constructor() {}
}
```
转译结果:
```
// ... 导入了400个包

require("regenerator-runtime/runtime");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hello = function hello() {};

var p = new Promise();
var m = new Map();

var A = function A() {
  _classCallCheck(this, A);
};

```

### useBuiltIns=usage

源码
```
const hello = () => {}

const p = new Promise()

const m = new Map()

class A {
  constructor() {}
}
```
转译结果:
```
// ... 省略十几个包
require("core-js/modules/web.dom-collections.iterator");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hello = function hello() {};

var p = new Promise();
var m = new Map();

var A = function A() {
  _classCallCheck(this, A);
};
```
综上所述: `useBuiltIns=false`，只是做语法转换,
`useBuiltIns=entry`会引入所有的es扩展包
`useBuiltIns=usage`会自动检查代码中用到的功能自动引入对应需要的模块

## @babel/runtime
它有2个作用：
- 生成不污染全局空间和对内置对象原型的代码
- 可以移除冗余的工具函数

`babel.config.js`配置:
```
module.exports = {
  presets: [
    [
      '@babel/preset-env'
    ]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: {
        version: 3,
        proposals: true
      }
    }]
  ]
}
```

源码
```
class A {
  constructor() {}
}
```
转译结果：
```
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var A = function A() {
  (0, _classCallCheck2["default"])(this, A);
};
```