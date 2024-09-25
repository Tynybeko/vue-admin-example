import { logout, getInfo, sendPhoneCode, checkPhoneCode, getUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import Cookies from 'js-cookie'

const state = {
  token: getToken(),
  introduction: '',
  inCheckPhone: false,
  user: null,
  roles: []

}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USER: (state, data) => {
    if (data) {
      localStorage.setItem('user', JSON.stringify(data))
    } else {
      localStorage.removeItem('user')
    }
    state.user = data
  },
  IS_CHECK_PHONE: (state, value) => {
    state.inCheckPhone = value
  },
  SET_ROLES: (state, value) => {
    state.roles = value
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone } = userInfo
    return new Promise((resolve, reject) => {
      sendPhoneCode({ phone: phone.trim() }).then(response => {
        commit('IS_CHECK_PHONE', true)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user code
  code({ commit }, data) {
    const { phone, code } = data
    return new Promise((resolve, reject) => {
      checkPhoneCode({ phone: phone.trim(), code: code.trim() })
        .then((response) => {
          getUser(response?.id)
            .then(data => {
              commit('SET_USER', data)
              commit('SET_ROLES', ['admin'])// вфыв!!!!!!
              resolve()
            })
            .catch(err => {
              console.log(err, 'ERRR')
              reject(err)
            })
        }).catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      let user = localStorage.getItem('user')
      if (!user) {
        reject('Verification failed, please Login again.')
      }
      user = JSON.parse(user)
      getInfo(user.id).then(response => {
        if (!response) {
          reject('Verification failed, please Login again.')
        }
        const { roles } = response
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', ['admin']) // фывыфв!!!!!!!
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_USER', null)
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        console.log('asdsadsadsadsadsad')
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
