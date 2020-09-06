/**
 * 背景:
 * 
 * 年底，CEO和CTO开始评定员工一年的工作绩效，员工分为工程师和经理，
 * CTO关注工程师的代码量、经理的新产品数量；
 * CEO关注的是工程师的KPI和经理的KPI以及新产品数量。
 * 由于CEO和CTO对于不同员工的关注点是不一样的，
 * 这就需要对不同员工类型进行不同的处理。访问者模式此时可以派上用场了。
 */

/**
 * 定义员工抽象类
 */
class Employee {
    constructor(name) {
        this.name = name;
        this.kpi = Math.random();
    }
}

// 工程师
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

//CTO关注工程师的代码量、经理的新产品数量
class CTO {
    constructor(visitor) {
        if (visitor instanceof Engineer) {
            console.log('工程师:  ' + visitor.name, '代码数量: ' + visitor.getCodeLines())
        } else if (visitor instanceof Manager) {
            console.log('经理: ' + visitor.name, '产品数量: ' + visitor.getProducts())
        }
    }
}

// CEO关注的是工程师的KPI和经理的KPI以及新产品数量
class CEO {
    constructor(visitor) {
        if (visitor instanceof Engineer) {
            console.log('工程师:  ' + visitor.name, 'KPI: ' + visitor.kpi)
        } else if (visitor instanceof Manager) {
            console.log('经理: ' + visitor.name, '产品数量: ' + visitor.getProducts(), 'KPI: ' + visitor.kpi)
        }
    }
}

console.log('CTO看报表：')
emplyees.forEach(e => {
    new CTO(e)
    
})

console.log('CEO看报表: ')
emplyees.forEach(e => {
    new CEO(e)
    
})