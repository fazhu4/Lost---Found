import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useResultStore = defineStore(
  'results',
  () => {
    // 个人信息
    const result = ref('')

    // 保存个人信息，登录时使用
    const setResult = (val) => {
      result.value = val
    }

    // 清理个人信息，退出时使用
    const clearResult = () => {
      result.value = undefined
    }

    // 记得 return
    return {
      result,
      setResult,
      clearResult,
    }
  },
  {
    // 网页端配置
    persist: true,
  },
)
