<template>
  <div>
    <button @click="onPlusHandler">click me ++</button>
    <button @click="onDivideHandler">click me --</button>
    <div class="container">{{state.count}}</div>
  </div>
</template>

<script>
import { reactive, watchEffect } from 'vue'

export default {
  setup () {
    const state = reactive({
      count: 1
    })

    watchEffect(() => {
      console.log(state.count)
    })

    const onPlusHandler = () => {
      state.count++
    }
    const onDivideHandler = () => {
      state.count--
    }
    return {
      state,
      onPlusHandler,
      onDivideHandler
    }
  }
}
</script>
