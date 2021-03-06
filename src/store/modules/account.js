import axios from 'axios'
import router from '@/route/router'

const API_BASE_URL = '/api/otofoto2be'

export default {
  namespaced: true,

  state: {
    user: null
  },
  mutations: {
    setAuthUser(state, user) {
      state.user = user || null;
    },
    setErrorMessage(state, error) {
      state.error = error
    },
    logout(state) {
      state.error = null
      state.user = null
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.user !== null
    },
    user(state) {
      return state.user || null
    },
  },
  actions: {
    login ({ commit }, payload) {
      const url = API_BASE_URL + '/login.php'
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      axios.post(url, formData).then(response => {
        commit('setAuthUser', response?.data?.user)
        commit('setErrorMessage', null, { root: true })
        router.push('/dashboard')
      }, (error) => {
        commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    },
    setAuthUser ({ commit }, user) {
      commit('setAuthUser', user)
      commit('setErrorMessage', null, { root: true })
    },
    setErrorMessage ({ commit }, state) {
      commit('setErrorMessage', state, { root: true })
    }
  }
}