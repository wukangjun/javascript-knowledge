<!--
 * @Author: wukangjun
 * @Date: 2020-09-17 20:52:23
 * @Description: write something
-->
<template>
  <div>
    <button @click="onOpenHandler">点我打开</button>
    <div v-show="visible">
      <h2>弹框标题</h2>
      <div>
        姓名： {{state.name}}
        身高: {{state.height}}
      </div>
      <button @click="onCloseHandler">点我关系</button>
      <button @click="increaseHeight">点我长高</button>
    </div>
  </div>
</template>

<script>
import { reactive, watchEffect } from 'vue'
import { useVisibleFunctional } from './shared/ectract/dialog'


function useRenderFunctional() {
  const state = reactive({
    name: '',
    height: 0,
    loading: false
  })
  const request = () => {
    state.loading = true
    setTimeout(() => {
      state.name = 'wukangjun'
      state.height = 180
      state.loading = false
    }, 1000)
  }
  const increaseHeight = () => {
    state.height++
  }

  return {
    state,
    request,
    increaseHeight
  }
}
// mixin 
// 1. 出处很难定位
// 2. 很容易覆盖
// 3. 代码逻辑分散
// 4. this指向
export default {
  name: 'App',
  setup() {
    const { state, request, increaseHeight } = useRenderFunctional()
    const { visible, onOpenHandler, onCloseHandler } = useVisibleFunctional()

    watchEffect(() => {
      if (visible.value) {
        request()
      }
    })

    return {
      state,
      visible,
      onOpenHandler,
      onCloseHandler,
      increaseHeight
    }
  }
  // data: () => {
  //   return {
  //     visible: false
  //   }
  // },
  // methods: {
  //   onOpenHandler() {
  //     this.visible = true
  //   },
  //   onCloseHandler() {
  //     this.visible = false
  //   }
  // },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
