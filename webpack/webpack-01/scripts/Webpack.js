const fs = require('fs')

module.exports = class Webpack {
  constructor(options) {
    const { entry, output } = options;

    this.entry = entry;
    this.output = output;
  }

  run() {
    console.log('webpack start')
    this.parse(this.entry)
  }

  parse(entryPath) {
    //! 1. 分析入口模块
    const content = fs.readFileSync(entryPath, 'utf-8')
    console.log(content)

    // 2. 分析依赖模块
    
  }
}