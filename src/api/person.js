import request from '@/utils/request'

// 返回识别历史记录
export const historyList = () => request.get('/user/history/identify')

// 返回收藏
export const collectList = () => request.get('/user/collection')

// 删除监测（非数据）
export const deletes = ({ id }) =>
  request.get('/user/history/delete', {
    params: { id },
  })

// 返回收藏
export const collectPercenalInfo = () => request.get('/user/info')
