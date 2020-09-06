const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default

const code = `
function hello(a, b) {
	return a + b;
}

`

var ast = parser.parse(code)
traverse(ast, {
    Identifier: function(path) {
        if (path.node.name === 'a') {
            path.node.name = 1;
        }
    }
})

var a = generator(ast)
console.log(a)