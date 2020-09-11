
const { parse } = require('@babel/parser')
const { default: traverse } = require('@babel/traverse')
const { default: generator } = require('@babel/generator')

const c = `
  function hello(a, b) {
    return a + b;
  }
`

const ast = parse(c)
traverse(ast, {
  ArrowFunctionExpression(path) {
    
  }
})

const { code } = generator(ast)
console.log(code)