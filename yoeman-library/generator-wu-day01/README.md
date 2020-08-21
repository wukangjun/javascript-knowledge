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
  - [异步任务](#asynctask)
- [用户交互](#userinteraction)
  - [参数](#prompt-arguments)
  - [选项](#options)
- [组合性](#composability)
  - [和一个Generator类合并](#composingOther)
- [管理依赖](#managingDependencies)
- [与文件系统交互](#interacting-file)



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

运行循环是一个具有`优先级支持的队列系统`。我们使用[Grouped-queue](https://github.com/wukangjun/javascript-knowledge/tree/master/grouped-queue)模块来处理运行循环。

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

### <a id="asynctask">异步任务</a>
有多种方法可以暂停运行循环，直到任务异步完成。

```
asyncTask() {
  var done = this.async();

  getUserEmail(function (err, name) {
    done(err);
  });
}
```
当有异步任务的时候
```
class App extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  first() {
    console.log('我开始了1')
  }

  second() {
    setTimeout(() => {
      console.log('我开始了2')
    })
  }

  third() {
    console.log('i am third')
  }
}
```
结果如下:
```
我开始了1
i am third
我开始了2
```

所以这个时候，那么您可以依赖遗留的this.async()方法。调用this.async()将返回一个在任务完成后调用的函数。为
```
second() {
  const done = this.async();
  setTimeout(() => {
    console.log('我开始了2')
    done();
  })
}
```
这样就可以保证异步任务可以按顺序进行
```
我开始了1
我开始了2
i am third
```

## <a id="userinteraction">用户交互</a>
提示是生成器与用户交互的主要方式。提示模块是由[inquler .js](https://github.com/SBoudrias/Inquirer.js#installation)提供的，您应该引用它的API来获得可用提示选项列表。

```
async prompting() {
    this.answers = await this.prompt([
      {
        type: 'list',
        name: 'framework',
        message: '你选择的项目框架',
        choices: [
          'vue12',
          'react',
          'anglar'
        ]
      },
      {
        type: 'confirm',
        name: 'cool',
        message: "Would you like to enable the Cool feature?"
      }
    ]);
    this.log('framework name', this.answers.framework)
    this.log('framework cool', this.answers.cool)
  }
```
结果如下：
```
? 你选择的项目框架 (Use arrow keys)
❯ vue12 
  react 
  anglar 

? 你选择的项目框架 vue12
? Would you like to enable the Cool feature? Yes
framework name vue12
framework cool true
```

### <a id="prompt-arguments">参数</a>
参数直接从命令行传递:
```
yo name my-project
```
在上面的例子中，`my-project`作为第一个参数.

为了通知系统我们需要一个参数，我们使用this. arguments()方法。这个方法接受一个名称(字符串)和一个可选的选项散列。

然后name参数将以如下方式可用:`this.options[name]`。
这个选项散列接受多个`key-value`键值对:
1. `desc` 对参数进行描述
2. `required` 这个参数必要的
3. `type` 参数类型(string, number, array)
4. `default` 参数有一个默认值
此方法必须在构造函数方法内部调用。否则当用户通过帮助选项调用生成器时，`yoeman`将不能输出相关的帮助信息:例如`yo webapp —help`。
```
class App extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('appname', { type: String, required: true })
    this.log(this.options.appname)
  }
}
```

### <a id="options">选项</a>
选项看起来很像参数，但是它们是作为命令行标志编写的。
```
yo webapp --coffee
```
为了通知系统我们需要一个选项，我们使用`this.option()`方法。这个方法接受一个名称(字符串)和一个可选的选项散列。

name值将用于检索匹配关键字`this.options[name]`处的选项。
选项哈希(第二个参数)接受多个键值对:

1. `desc`选项的desc描述
2. `alias`选项的别名
3. `type`输入Boolean、String或Number(也可以是接收原始字符串值并对其进行解析的自定义函数)
4. `default`默认值
5. `hide`隐藏是否隐藏帮助的布尔值

## <a id="composability">组合性</a>
`yoeman`提供多种方式`generator`建立在共同的基础上。重写相同的功能没有任何意义，因此提供了一个API来在其他生成器中使用生成器。

`yoeman`的可组合性可以通过两种方式发起:
* 一个generator可以决定将自己与另一个generator组合(例如，`generator-backbone`使用`generator-mocha`)。
* 最终用户也可以发起组合(例如，Simon想用SASS和Rails生成主干项目)。注意:最终用户发起的组合是一个计划中的特性，目前还不可用。

### <a id="composeWith">`this.composeWith()`</a>
composeWith方法允许生成器与另一个生成器(或子生成器)并排运行。这样，它就可以使用来自其他生成器的特性，而不必完全靠自己完成。
在组合时，不要忘记运行上下文和运行循环。在给定的优先级组执行中，所有组合生成器都将执行该组中的函数。然后，这将为下一组重复。生成器之间的执行顺序与调用composeWith的顺序相同，请参见执行示例。

### API
`composeWith` 带有2个参数.
1. `generatorPath` - 指向要组合使用的生成器的完整路径 (通常使用require.resolve()).
2. `options` - 一个对象，其中包含在运行后传递给组合生成器的选项。
```
this.composeWith(require.resolve('generator-bootstrap/generators/app'), {preprocessor: 'sass'});
```

### <a id="composingOther">和一个Generator类合并</a>
`composeWith`也可以带有一个对象作为它的第一个参数.这个对象应该有以下属性
* `Generator` 需要组合的generator类
* `path` generator文件的路径
```
// Import generator-node's main generator
const NodeGenerator = require('generator-node/generators/app/index.js');

// Compose with it
this.composeWith({
  Generator: NodeGenerator,
  path: require.resolve('generator-node/generators/app')
});
```

### 执行的案例
```
// In my-generator/generators/turbo/index.js
module.exports = class extends Generator {
  prompting() {
    this.log('prompting - turbo');
  }

  writing() {
    this.log('writing - turbo');
  }
};

// In my-generator/generators/electric/index.js
module.exports = class extends Generator {
  prompting() {
    this.log('prompting - zap');
  }

  writing() {
    this.log('writing - zap');
  }
};

// In my-generator/generators/app/index.js
module.exports = class extends Generator {
  initializing() {
    this.composeWith(require.resolve('../turbo'));
    this.composeWith(require.resolve('../electric'));
  }
};
```
结果如下:
```
prompting - turbo
prompting - zap
writing - turbo
writing - zap
```

## <a id="managingDependencies">管理依赖</a>
一旦您运行了生成器，您通常会希望运行npm(或Yarn)和Bower来安装生成器所需的任何附加依赖项。

由于这些任务非常频繁，`yoeman`已经将它们抽象出来。我们还将介绍如何通过其他工具启动安装。

请注意，`yoeman`提供的安装助手将自动安排安装作为安装队列的一部分运行一次。如果您需要在它们运行之后运行任何内容，请使用`end`队列。

### npm
您只需要调用`this.npmInstall()`来运行npm安装。`Yeoman`将确保npm安装命令只运行一次，即使它被多个生成器调用多次。

例如，你想安装lodash作为一个开发依赖:
```
class extends Generator {
  installingLodash() {
    this.npmInstall(['lodash'], { 'save-dev': true });
  }
}
```
这个等价于:
```
npm install lodash --save-dev
```

### 以编程方式管理npm依赖关系
您可以编程地创建或扩展您的`package.json`文件，如果您不想使用模板，但喜欢有固定版本的依赖。`yoeman`的文件系统工具可以帮助你完成这项工作。

定义eslint作为dev依赖和react作为依赖的例子:
```
class extends Generator {
  writing() {
    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }
};
```

### Using other tools
Yeoman提供了一个抽象来允许用户生成任何CLI命令。这个抽象将规范化为command，这样它就可以在Linux、Mac和Windows系统中无缝运行。

例如，如果你是一个PHP迷，并希望运行composer，你会这样写:
```
class extends Generator {
  install() {
    this.spawnCommand('composer', ['install']);
  }
}
```

## <a id="interacting-file">与文件系统交互</a>

### 本地上下文和路径
`yoeman`文件实用程序是基于这样的想法:`在磁盘上总是有两个位置上下文`。这些上下文是生成器最有可能读写的文件夹。

### 目标上下文
第一个上下文是目标上下文。目标是`yoeman`将在其中搭建一个新应用程序的文件夹。它是您的用户项目文件夹，您将在这里编写大部分脚手架(就是你的项目根路径)。

你可以使用`this.destinationRoot()`或者使用this.destinationPath('sub/path')加入一个路径来获得目标路径。
```
class extends Generator {
  paths() {
    this.destinationRoot();
    // returns '~/projects'

    this.destinationPath('index.js');
    // returns '~/projects/index.js'
  }
}
```

### 模版上下文
模板上下文是存储模板文件的文件夹。它通常是你阅读和复制的文件夹。
模板上下文默认定义为`./templates/`。你可以用`this.sourceroot('new/template/path')`覆盖这个默认值。

你可以使用`this.sourceRoot()`或者使用`this.templatePath('app/index.js')`连接一个路径来获得路径值。
```
class extends Generator {
  paths() {
    this.sourceRoot();
    // returns './templates'

    this.templatePath('index.js');
    // returns './templates/index.js'
  }
};
```

### 内存的文件系统
当涉及到覆盖用户文件时，Yeoman是非常小心的。基本上，对预先存在的文件发生的每一次写操作都将经历一个冲突解决过程。此过程要求用户验证覆盖其文件内容的每个文件写入。

这种行为防止了糟糕的意外，并限制了错误的风险。另一方面，这意味着每个文件都是异步写入磁盘的。

由于异步API难以使用，Yeoman提供了一个同步文件系统API，其中每个文件都被写到内存中的文件系统中，并且在Yeoman运行完后只写到磁盘一次。

这个内存文件系统在所有组合生成器之间共享。

### 文件实用方法
生成器在此公开所有文件方法。它是[mem-fs editor](https://github.com/sboudrias/mem-fs-editor)的一个实例——请确保检查模块文档中所有可用的方法。

值得注意的是，尽管`this.fs`公开提交，您不应该在生成器中调用它。在run循环的冲突阶段之后，Yeoman在内部调用它。

```
class extends Generator {
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
}
```

### 通过流转换输出文件
生成器系统允许您对每个文件写入应用自定义过滤器。自动美化文件，正常化空白，等等，是完全可能的。

每次`yoeman`进程一次，我们将把每个修改后的文件写入磁盘。这个过程通过一个乙烯对象流传递(就像gulp一样)。任何生成器作者都可以注册transformStream来修改文件路径和/或内容。

注册一个新的修饰符是通过registerTransformStream()方法完成的。这里有一个例子: