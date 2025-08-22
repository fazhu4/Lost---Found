import request from '@/utils/request'

// 全国谣言词云图
export const nationalWord = () => request.get('/nationwide/rumor/WCD')

// 全国谣言类别统计榜
export const nationalKinds = () => request.get('/nationwide/rumor/category')

// 全国谣言热榜
export const nationalHotList = ({ limit, page }) =>
  request.get('/nationwide/rumor/list', {
    params: { limit, page },
  })

// 全国谣言类别统计榜
export const nationalRegion = () => request.get('/nationwide/crawler/category')

// 返回监测历史记录
export const monitorHistory = ({ type, keyword }) =>
  request.get('/user/history/monitoring', {
    params: { type, keyword },
  })
