import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import clients from './modules/clients'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setErrorMessage(state, error) {
      state.error = error
    },
  },
  actions: {
    setErrorMessage ({ commit }, state) {
      commit('setErrorMessage', state)
    }
  },
  getters: {
    error(state) {
      return state.error || null
    }
  },
  modules: {
    account,
    clients
  }
})
