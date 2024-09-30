import request from '@/utils/request'

export function sendPhoneCode(data) {
  return request({
    url: '/api/auth/login-sms/send',
    method: 'post',
    data
  })
}

export function checkPhoneCode(data) {
  return request({
    url: '/api/auth/login-sms/check',
    method: 'post',
    data
  })
}

export function getUser(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'get'

  })
}
export function getInfo(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}
