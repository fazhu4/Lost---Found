import request from '@/utils/request'

// 登录接口
export const userRegisterService = ({ account, password }) =>
  request.get('/login', {
    params: { account, password },
  })

// 注册接口
export const userAccount = ({ name, account, password, email }) => request.post('/register', { name, account, password, email })
