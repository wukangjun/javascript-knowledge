<template>
  <div>
    <ui class="a">
      <li v-for="item in state.list" :key="item" @click="handler(item)">
        <div>{{item.a}}</div>
      </li>
    </ui>
  </div>
</template>

<script>
import { reactive } from 'vue';
import a from './index'

export default {
  components: {
    a
  },

  setup() {
    const state = reactive({
      list: []
    })
    
    const handler = (item) => {
      console.log(item)
    }

    return {
      state,
      handler
    }
  }
}
</script>

