const Generator = require('yeoman-generator')

module.exports = class App extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('appname', { type: String, required: true })

    this.log(this.options.appname)
  }
}

