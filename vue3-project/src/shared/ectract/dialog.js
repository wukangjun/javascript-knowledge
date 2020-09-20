/*
 * @Author: wukangjun
 * @Date: 2020-09-17 21:46:48
 * @Description: write something
 */
import { ref } from 'vue'

export function useVisibleFunctional() {
    // 返回新的对象
    const visible = ref(false)
    const onOpenHandler = () => {
        visible.value = true
    }
    const onCloseHandler = () => {
        visible.value = false
    }

    return {
        visible,
        onOpenHandler,
        onCloseHandler
    }
}