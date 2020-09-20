
module.exports = class MarkdownPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('DefinePlugin', compilation => {
      for (const chunk of compilation.chunks) {
        console.log(chunk)
      }
    })
  }
}