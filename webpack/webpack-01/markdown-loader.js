const path = require('path')
const qs = require('querystring')
const selectBlock = require('./select')
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

  const stringifyRequest = r => loaderUtils.stringifyRequest(loaderContext, r)

  const {
    // loaderPath?sourcePath  (加载器路径?协议的目标路径)
    request,
    sourceMap,
    emitFile,
    // 项目的根路径
    rootContext,
    // 目标路径
    resourcePath,
    resourceQuery
  } = loaderContext

  //a=12&b=10
  const rawQuery = resourceQuery.slice(1)
  const inheritQuery = `&${rawQuery}`
  const incomingQuery = qs.parse(rawQuery)
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


 if (incomingQuery.type) {
  return selectBlock(
    descriptor,
    loaderContext,
    incomingQuery,
    !!options.appendExtension
  )
 }

  // template
  let templateImport
  if (descriptor.template) {
    const src = descriptor.script.src || resourcePath
    const query = `?vue&type=template${inheritQuery}`
    const request = stringifyRequest(src + query)
    templateImport = `import a from ${request}`
  }

  // script
  let scriptImport = `var script = {}`
  if (descriptor.script) {
    const src =descriptor.script.src || resourcePath
    const query = `?vue&type=script${inheritQuery}`
    const request = stringifyRequest(src + query)
    scriptImport = (
      `import script from ${request}\n` +
      `export * from ${request}`
    )
  }

  // styles
  let stylesCode = ``

  let code = `
  ${templateImport}
  ${scriptImport}
  `
  //emitFile(templateName, descriptor.template.content)

  return code;
}