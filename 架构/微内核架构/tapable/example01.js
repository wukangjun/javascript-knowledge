const { SyncHook } = require("tapable");

/**
 * 汽车的内核
 * 
 * 加速度
 * 刹车
 * 
 */
class Car {
    constructor () {
        this.hooks = {
            start: new SyncHook(),
            accelerate: new SyncHook(['speed']),
            break: new SyncHook()
        }
    }

    start() {
        this.hooks.start.call();
    }

    setSpeed(speed) {
        this.hooks.accelerate.call(speed)
    }

    stop(a) {
        this.hooks.break.call()
    }
}


// use
// make
var car = new Car()

// 汽车的起来
car.start();
