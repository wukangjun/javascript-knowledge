
const { reactive, computed }  =  require('@vue/reactivity')

const state = reactive({
  count: 1
})

const double = computed(() => state.count * 2)