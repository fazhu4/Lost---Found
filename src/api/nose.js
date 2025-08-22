import request from '@/utils/request'

// 手动识别接口
export const userNoseService = ({ title, text, img_path, comments, form }) =>
  request.post('/rumor/upload_text', {
    title,
    text,
    img_path,
    comments,
    form,
  })

// 自动识别接口
export const userBestNose = ({ url, type }) =>
  request.post('/rumor/upload_url', {
    url,
    type,
  })

// 收藏
export const collecting = ({ results_id }) => request.post('/collection/insert', { results_id })

// 取消收藏
export const concealCollect = ({ results_id }) => request.post('/collection/delete', { results_id })

//返回谣言事件库的结果
export const monitorStatic = ({ id }) =>
  request.get('/rumor/crawler_bad/result', {
    params: { id },
  })

//返回谣言事件库的结果
export const myStatic = ({ results_id }) =>
  request.get('/rumor/outcome', {
    params: { results_id },
  })

//返回谣言事件库的结果
export const seePicture = ({ name }) => request.get(`/browse/${encodeURIComponent(name)}`)
