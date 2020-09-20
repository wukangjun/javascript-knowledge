
export function proxy(data) {
  let vm = {}
  Object.keys(data).forEach(key => {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      // 取值操作
      get() {
        console.log('get:', key, data[key])
        return data[key]
      },
      // 赋值操作
      set(value) {
        console.log('set:', key, value)
        data[key] = value;
      }
    })
  });
  return vm;
}