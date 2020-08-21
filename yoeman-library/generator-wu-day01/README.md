# yoeman的generator库
Yeoman是现代化前端项目的脚手架工具，用于生成包含指定框架结构的工程化目录结构

- [设置项目的基础package.json信息](#first)
- [构建项目目录](#generator)
- [扩展开发自己的generator](#extending)
  - [下载基础的generator](#install-base-generator)
  - [继承基础generator类](#extend-base-generator)
  - [添加自己的功能](#adding-your-own-functionality)
- [运行上下文](#runingcontext)
  - [辅助和私有方法](#helperandprivate)
  - [循环运行](#runloop)


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


## <a id="runingcontext">运行上下文</a>
在编写生成器时，需要掌握的最重要的概念之一是方法如何运行以及在什么上下文中运行。
每个直接附加到生成器原型的方法都被认为是一个任务。每个任务由`yoeman`环境运行循环依次运行。
换句话说，`object.getprototypeof(Generator)`返回的对象上的每个函数将自动运行。

### <a id="helperandprivate">辅助和私有方法</a>
既然您知道原型方法被认为是一项任务，那么您可能想知道如何定义不会被自动调用的helper或private方法。有三种不同的方法来实现这一点。
1. 以下划线作为方法名称的前缀(例如:_private_method)。
```
class App extends Generator {
  method1() {
    console.log('hey 1');
  }
  // 私有方法
  _private_method() {
    console.log('private hey');
  }
}
```
2. 使用实例方法
```
class extends Generator {
     constructor(args, opts) {
       // Calling the super constructor is important so our generator is correctly set up
       super(args, opts)

      // 实例方法
       this.helperMethod = function () {
         console.log('won\'t be called automatically');
       };
     }
   }
```
3. 继承一个父generator
```
class MyBase extends Generator {
     helper() {
       console.log('methods on the parent generator won\'t be called automatically');
     }
   }

   module.exports = class extends MyBase {
     exec() {
       this.helper();
     }
   };
```

### <a id="runloop">循环运行</a>
如果只有一个生成器，那么顺序运行任务是可以的。但一旦你开始组合生成器，这还不够。

这就是为什么`yoeman`使用运行循环。

运行循环是一个具有`优先级支持的队列系统`。我们使用`Grouped-queue`模块来处理运行循环。

优先级在代码中定义为特殊的原型方法名。当方法名称与优先级名称相同时，run循环将该方法推入这个特殊队列。如果方法名称与优先级不匹配，则将其推入默认组。

在代码中，它看起来是这样的:
```
class extends Generator {
  priorityName() {}
}
```
你也可以通过使用一个散列而不是一个方法将多个方法组合在一起运行在一个队列中:
```
Generator.extend({
  priorityName: {
    method() {},
    method2() {}
  }
});
```
可用的优先级有(按运行顺序):

1. `initializing`—您的初始化方法(检查当前项目状态，获取配置，等等)
2. `prompting`——提示用户输入选项(调用this.prompt())
3. `configuring`——保存配置并配置项目(创建.editorconfig文件和其他元数据文件)
4. `default`——如果方法名与优先级不匹配，它将被推送到这个组。
5. `writing`——你写生成器的特定文件(路由，控制器等)
6. `conflicts`——处理冲突的地方(内部使用)
7. `install`——安装运行的位置(npm, bower)
8. `end`-打电话结束，清理，说再见，等等