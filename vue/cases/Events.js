/**
 * 中央处理中心
 */
class EventEmitter {
  constructor() {
    this.handlers = {}
  }

  // 订阅
  on(type, handler) {
    if (!this.handler[type]) {
      this.handler[type] = [];
    }
    this.handlers[type].push(handler)
  }

  emit(type, ...args) {
    if (this.handlers.hasOwnProperty(type)) {
      this.handlers[type].forEach(handler => {
        handler.apply(null, args)
      })
    } else {
      throw new Error('未注册');
    }
  }

  remove(type, handler) {
    if (!this.handlers.hasOwnProperty(type)) {
      throw new Error(type + '未注册')
    }

    if (!handler) {
      delete this.handlers[type]
    } else {
      const idx = this.handlers[type].findIndex(el => el === handler)
      if (idx >=0) {
        this.handlers[type].splice(idx, 1);
      }
      if (this.handlers[type].length === 0) {
        delete this.handlers[type]
      }
    }
  }
}