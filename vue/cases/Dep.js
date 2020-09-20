// dependence
export default class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    if (sub) {
      this.subs.push(sub)
    } else {
      throw new Error('sub is not Watcher')
    }
  }


  notify() {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
}
