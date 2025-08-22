import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useImgStore = defineStore(
  'imgs',
  () => {
    const imgName = ref({})

    const setImg = (val) => {
      imgName.value = val
    }

    const clearImg = () => {
      imgName.value = undefined
    }

    // 记得 return
    return {
      imgName,
      setImg,
      clearImg,
    }
  },
  {
    // 网页端配置
    persist: true,
    // 小程序端配置
    // persist: {
    //   storage: {
    //     getItem(key) {
    //       return uni.getStorageSync(key)
    //     },
    //     setItem(key, value) {
    //       uni.setStorageSync(key, value)
    //     },
    //   },
    // },
  },
)
