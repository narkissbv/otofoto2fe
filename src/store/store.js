import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import clients from './modules/clients'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null,
    message: null
  },
  mutations: {
    setErrorMessage(state, error) {
      state.error = error
    },
    setMessage(state, message) {
      state.message = message
    },
    clearMessages(state) {
      state.message = null,
      state.error = null
    }
  },
  actions: {
    setErrorMessage ({ commit }, state) {
      commit('setErrorMessage', state)
    },
    setMessage ({ commit }, state) {
      commit('setMessage', state)
    },
    clearMessages ({ commit }, state) {
      commit('clearMessages', state)
    }
  },
  getters: {
    error(state) {
      return state.error || null
    },
    message(state) {
      return state.message || null
    }
  },
  modules: {
    account,
    clients
  }
})
