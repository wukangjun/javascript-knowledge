const path = require('path')
const loaderUtils = require('loader-utils')
// 将vue文件的外层标签内容分离
const { parse } = require('@vue/component-compiler-utils')


function loadTemplateCompiler (loaderContext) {
  try {
    return require('vue-template-compiler')
  } catch (e) {
    if (/version mismatch/.test(e.toString())) {
      loaderContext.emitError(e)
    } else {
      loaderContext.emitError(new Error(
        `[vue-loader] vue-template-compiler must be installed as a peer dependency, ` +
        `or a compatible compiler implementation must be passed via options.`
      ))
    }
  }
}

module.exports = function (source) {
  const loaderContext = this

  const {
    // loaderPath?sourcePath  (加载器路径?协议的目标路径)
    request,
    sourceMap,
    // 项目的根路径
    rootContext,
    // 目标路径
    resourcePath,
    resourceQuery
  } = loaderContext

  const options = loaderUtils.getOptions(loaderContext || {})

  const filename = path.basename(resourcePath)
  const context = rootContext || process.cwd()
  const sourceRoot = path.dirname(path.relative(context, resourcePath))

  const descriptor = parse({
    source,
    compiler: loadTemplateCompiler(loaderContext),
    filename,
    sourceRoot
  })

  console.log(resourcePath)

  return descriptor.script.content;
}