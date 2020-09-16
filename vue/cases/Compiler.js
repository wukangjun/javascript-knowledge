import Watcher from "./Watcher";

const directives = {
  model(node, vm, key) {
    node.value = vm[key];
    new Watcher(vm, key, (newVal) => {
      node.value = newVal;
    });
    node.addEventListener('input', () => {
      vm[key] = node.value;
    })
  },

  text(node, vm, key) {
    node.textContent = vm[key];
    new Watcher(vm, key, (newVal) => {
      node.textContent = newVal;
    });
  }
}


export default class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el)
  }

  /**
   * 编译模版, 处理文本节点和元素节点
   * 
   * @param {*} el 
   */
  compile(el) {
    // 获取所有子节点
    // 结构： 伪数组
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 编译文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素是节点
        this.compileElement(node)
      }

      // 判断node是否有子节点，进行递归调用
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  /**
   * 编译元素节点， 处理指令
   * 
   * @param {*} node 
   */
  compileElement(node) {
    let attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // v-model -> model
        // v-text -> text
        let splitAttrName = attrName.substr(2);
        let key = attr.value;
        if (directives[splitAttrName]) {
          directives[splitAttrName](node, this.vm, key);
        }
      }
    })
  }

  /**
   * 编译文本节点， 处理差值表达式
   * 
   * {{ name }}
   * 
   * @param {*} node 
   */
  compileText(node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent;
    if (reg.test(value)) {
      const key = RegExp.$1;
      node.textContent = value.replace(reg, this.vm[key])
      // 创建Watch对象
      new Watcher(this.vm, key, (newVal) => {
        node.textContent = newVal;
      })
    }
  }

  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  isTextNode(node) {
    return node && node.nodeType === 3;
  }

  isElementNode(node) {
    return node && node.nodeType === 1;
  }
}