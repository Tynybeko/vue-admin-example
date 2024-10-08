import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'
// import Cookies from 'js-cookie'

const DEV = process.env.NODE_ENV === 'production'
// create an axios instance
const service = axios.create({
  baseURL: DEV ? process.env.VUE_APP_BASE_API : '', // url = base url + request url
  timeout: 5000,
  mode: 'no-cors',
  withCredentials: true,
  credentials: 'same-origin',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }

  // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }

)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (response.status < 200 && response.status > 299) {
      Message({
        message: (res.message || 'Error'),
        type: 'error',
        duration: 5 * 1000
      })

      if (response.status === 500) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      console.log(response)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // if (!error.response) {
    //   localStorage.removeItem('user')
    //   window.location.reload()
    // }

    // if (error.response && error.response.status === 401) {
    //   localStorage.removeItem('user')
    //   window.location.reload()
    // }
    console.log('err', error) // for debug
    Message({
      message: error?.response?.data?.message ?? error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
