# yoeman的generator库
Yeoman是现代化前端项目的脚手架工具，用于生成包含指定框架结构的工程化目录结构

- [设置项目的基础package.json信息](#first)
- [构建项目目录](#generator)
- [扩展开发自己的generator](#extending)
  - [下载基础的generator](#install-base-generator)
  - [继承基础generator类](#extend-base-generator)
  - [添加自己的功能](#adding-your-own-functionality)


## <a id="first">设置项目的基础package.json信息</a>
首先设置项目的名称, 必须是以`generator-name`的规则的目录名称,因为`yoeman`依赖的文件系统去查找可用的generator。
`package.json`的关键字段规则:
* `name`属性必须是以`generator-`为前缀;
* `keywords`字段必须包含`yeoman-generator`
* 项目依赖`yeoman-generator`核心库,需要安装下载
* files属性必须是生成器所使用的文件和目录的数组。


```
{
  "name": "generator-name",
  "keywords": ["yeoman-generator"],
  "files": ["generators"],
  "dependencies": {
    "yeoman-generator": "^1.0.0"
  }
}
```

## <a id="generator">构建项目目录</a>
`yeoman`的功能取决于如何构建你的项目目录,每个子集的generator都包含在自己的文件夹内.
当你调用`yo [generator-name]`,默认的生成器是app生成器,它必须包含在app目录下。
当你调用`yo [generator-name]:[subCommand]`的时候，使用的子生成器所在目录与`[subCommand]`的名字保持一致。
```
.
├── README.md
├── generators
│   ├── app
│   │   └── index.js
│   └── router
│       └── index.js
└── package.json

```

## <a id="extending">扩展开发自己的generator</a>
`yeoman`提供了一个你可以扩展和实现你自己行为的基础生成器.这个基本生成器将添加您希望减轻任务的大部分功能。

### <a id="install-base-generator">下载基础的generator</a>
npm usage
```
npm install yeoman-generator -S
```
or
yarn usage
```
yarn add yeoman-generator -S
```

### <a id="extend-base-generator">继承基础generaor类</a>
```
const Generator = require('yeoman-generator')

module.exports = class App extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
}
```

### <a id="adding-your-own-functionality">添加自己的功能</a>
每次调用生成器时，都会运行添加到原型中的每个方法——`而且通常是按顺序运行的`。但是，正如我们将在下一节中看到的，一些特殊的方法名称将触发特定的运行顺序。
```
const Generator = require('yeoman-generator')

module.exports = class App extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  handler1() {
    console.log('我开始了1')
  }

  handler2() {
    console.log('我开始了2')
  }
}
```

此时，您已经有了一个工作的生成器。接下来的逻辑步骤是运行它，看看它是否能工作。

因为您是在本地开发生成器，所以它还不能作为全局npm模块使用。可以使用npm创建全局模块并将其符号链接到本地模块。下面是你想要做的:

在命令行中，从生成器项目的根目录(在生成器名称/文件夹中)输入:
```
npm link
```
然后验证本地generator库是否缓存在本地模块,使用如下命令验证(generator前缀不用写)
```
yo name --help
```

在需要的项目根路径下，使用如下命令:
```
$ yo name
```
结果
```
我开始了1
我开始了2
```
