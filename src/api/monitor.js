import request from '@/utils/request'
import { type } from 'jquery'

// 定制化监测
export const monitoring = ({ keyword, start_time, end_time, platform }) =>
  request.post('/rumor/monitoring', { keyword, start_time, end_time, platform })

// 返回监测历史记录
export const monitorHistory = ({ type, keyword }) =>
  request.get('/user/history/monitoring', {
    params: { type, keyword },
  })

// 返回谣言事件库
export const monitorLists = ({ limit, page, type, keyword }) =>
  request.get('/rumor/crawler_bad', {
    params: { limit, page, type, keyword },
  })

// 删除监测（非数据）
export const deleteFal = ({ id }) =>
  request.get('/rumor/monitoring/delete', {
    params: { id },
  })

// 删除监察（查出来的数据）
export const deleteRig = ({ id, result_id }) =>
  request.get('/rumor/monitoring/data_delete', {
    params: { id, result_id },
  })
