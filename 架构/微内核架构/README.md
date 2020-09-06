# 微内核架构
是一种基于插件的架构方式，通过编写精简的微内核来支撑以 plugin 的方式来添加更多丰富的功能
微内核架构在我们常用的应用和框架里面非常常见，比如工具有 IntelliJ、Chrome、Sublime、Photoshop 等， 前端框架有 jQuery、Babel、Webpack 等，基本比较流行的应用和框架都采用了微内核架构，虽然具体技术实现不同，但从思想上，它们都利用了插件机制带来的扩展性和灵活性。

## 目录
- [什么是微内核架构](#what)
- [webpack微内核架构](#webpack)
    - [Loader](#loader)
    - [Tapable Plugin Framework](#tapable)
    - [Plugin设计](#plugin)


## <a id="what">什么是微内核架构</a>
微内核架构包含两个核心概念：内核系统和插件模块
内核系统在运行时候需要知道可用的插件，并获取它们的引用。比较常见的方式是微内核实现一种类注册表的机制，插件会注册到注册表中，从而微内核在适当的时机完成对插件的调用。微内核和插件之间的具体通信协议在架构模式层面并没做具体限制，可以是在同一个进程内，也可以是分布式的，可以通过 Socket 通信，也可以通过 HTTP 通信。`关键的是插件可以扩展微内核，并且各个插件之间的功能各自独立。`

## <a id="webpack">Webpack的微内核架构</a>
Webpack 的整体概念设计包括 Compiler、Loader 和 Plugin
- Compiler: 从业务上来讲， Webpack 本质上就是一个编译器，Compiler 实现了核心的微内核架构，将 Loader 和Plugin 合理的组织在一起
- Loader: 不同类型的资源加载器，比如 css-loader，babel-loader
- Plugin: Compiler 在整个编译过程中，以 Hook 的形式暴露出了一系列回调，以供开发者编写 Plugin 来接收 Hook 并处理

### <a id="loader">Loader</a>
`loader`接收`Compiler`传递的字符串形式的文件，经过编译和转换成为 javascript 之后将结果返还给 webpack 的 Compiler。Compiler 会从返回的结果中解析需要继续加载的 module

### <a id="tapable">Tapable Plugin Framework</a>
在讲 Webpack 的 Plugin 实现之前，需要提一下 webpack 中衍生出来的 Tapable Plugin Framework。`Tapable 是 webpack 插件架构的核心`，极大简化了 webpack 的整体架构。虽然它在为 webpack 服务，但庆幸的是 Tapable 的优雅抽象使得我们能用它来编写其他微内核架构。
Tapable 中核心概念包括 Hook 和 Tap。Hook 是 Compiler 编译过程中主动释放出的接口，Tap 可以为理解 HookHandler

### <a id="plugin">Plugin设计</a>
ompiler 使用 Loader 加载完成 javascript 之后，会在 Compiler 中调用各种 Hook 来完成核心的打包编译逻辑，而这些核心的打包和处理逻辑全都是 Plugin 实现了 Hook 回调来完成的 
