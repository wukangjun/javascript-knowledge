class Employee {
    constructor(name) {
        this.name = name;
        this.kpi = Math.random();
    }

    accept(visitor) {
        visitor.visit(this)
    }
}


//
// 工程师元素
class Engineer extends Employee {
    constructor(name) {
        super(name);
    }

    getCodeLines() {
        return 2
    }
}

// 经理
class Manager extends Employee {
    constructor(name) {
        super(name);
    }

    getProducts() {
        return 1
    }
}

const emplyees = [
    new Engineer('工程师-A'),
    new Manager('经理-A'),
    new Engineer('工程师-B'),
    new Manager('经理-B'),
    new Manager('经理-C'),
    new Engineer('工程师-C'),
    new Engineer('工程师-D'),
    new Manager('经理-D'),
    new Manager('经理-E'),
    new Engineer('工程师-E')
];

class CTO {
    visit(element) {
        const opts = {
            Identifier() {
                
            },
            CallExpression() {

            }
        }
        return opts[element.name].call(null, element)
    }
}

var cto = new CTO()

emplyees.forEach(e => {
    e.accept(cto)
})