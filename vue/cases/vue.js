import Compiler from './Compiler'
import Dep from './Dep'

function defineReactive(obj, key, val) {
  // 为每个属性创建一个依赖收集器
  var dep = new Dep()

  observer(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 收集依赖
      if (Dep.target) {
        dep.addSub(Dep.target)
      }

      return val;
    },
    set(newVal) {
      if (newVal === val) {
        return
      }
      val = newVal;
      observer(val)
      // 发送通知,进行视图更新
      dep.notify();
    }
  })
}

class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function observer(data) {
  if (data === null || typeof data !== 'object') {
    return;
  }
  return new Observer(data)
}

function initData(vm) {
  const data = vm.$data;
  Object.keys(data).forEach(key => {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get() {
        return data[key];
      },
      set(value) {
        data[key] = value; 
      }
    })
  });
  // 数据响应
  observer(data)
}

export default class Vue {
  constructor(options) {
    // 保存选项的属性
    this.$options = options || {};
    this.$data = this.$options.data || {};
    this.$el = typeof this.$options.el === 'string' ? document.querySelector(this.$options.el) : this.$options.el;

    // 把data成员注入到Vue实例中，每个成员转换成getter/setter
    initData(this)
    new Compiler(this)
  }
}