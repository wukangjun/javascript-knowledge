import Vue from './cases/vue'

const vm = new Vue({
  data: {
    name: 'wu',
    height: 180,
    p: {
      n: 'w',
      h: 10
    }
  },
  el: '#app'
})


global.vm = vm;