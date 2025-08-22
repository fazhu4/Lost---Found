import axios from 'axios'
import { usePersonStore } from '@/stores'
import { ElMessage } from 'element-plus'
const getToken = usePersonStore()
// 环境配置（根据实际需求调整）
const URL = 'http://8.153.198.100:8091' // 后端基地址

// 创建 Axios 实例
const request = axios.create({
  baseURL: URL,
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 1. 确保 URL 统一处理（非 http 开头时拼接基地址）
    if (!config.url.startsWith('http')) {
      config.url = `${URL}${config.url.startsWith('/') ? '' : '/'}${config.url}`
    }

    console.log('Request URL:', config.url) // 调试用
    const userData = JSON.parse(localStorage.getItem('authToken'))
    console.log(userData)
    // 3. 统一添加请求头（示例 Token）
    config.headers['Authorization'] = userData // 默认 Token

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 2xx 状态码：直接返回核心数据

    return response.data
  },
  (error) => {
    // 统一错误处理
    let errorMsg = '网络异常，请稍后重试'
    if (error.response) {
      // 有响应但状态码非 2xx
      errorMsg = error.response.data?.message || `请求错误：${error.response.status}`
    } else if (error.request) {
      // 请求已发出但无响应（如超时）
      errorMsg = '服务器未响应，请检查网络'
    }
    console.error('API Error:', errorMsg)
    ElMessage.error(errorMsg)
    return Promise.reject(error)
  },
)

export default request
