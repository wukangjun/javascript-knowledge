import Dep from './Dep'

export default class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中的属性
    this.key = key;
    // 回调更新视图
    this.cb = cb;
    Dep.target = this;
    this.oldValue = this.vm[key];
    Dep.target = null;
  }

  // 更新视图
  update() {
    let newValue = this.vm[this.key];
    if (newValue === this.oldValue) {
      return;
    }
    
    this.cb(newValue, this.oldValue);
    this.oldValue = newValue;
  }
}