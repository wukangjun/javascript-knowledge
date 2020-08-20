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