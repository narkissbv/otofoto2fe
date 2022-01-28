// import axios from 'axios'
import { sendAPI } from '@/utils/utils'

export default {
  namespaced: true,

  state: {
    clients: []
  },
  mutations: {
    setClients (state, clients) {
      state.clients = clients
    },
    updateClient (state, payload) {
      const client = state.clients.find( function (client) {
        return client.username === payload?.data?.username
      })
      Object.assign(client, payload.data)
    }
  },
  actions: {
    fetchClients ({ commit }) {
      sendAPI('getClients').then(response => {
        commit('setClients', response?.data?.clients)
      })
    },
    addClient (context, payload) {
      sendAPI('addClient', payload).then( (resp) => {
        context.dispatch('fetchClients')
        context.commit('setMessage',
          `${resp.data.message} Username: ${resp.data.data.username} Password: ${resp.data.data.password}`,
        { root: true })
      }, error => {
        context.commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    },
    editClient ({ commit }, payload) {
      sendAPI('editClient', payload).then( (response) => {
        commit('updateClient', response.data)
      }, error => {
        commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    },
    delete (context, payload) {
      sendAPI('deleteClient', payload).then( resp => {
        context.dispatch('fetchClients')
        context.dispatch('setMessage', resp.data.message, { root: true })
      }, error => {
        context.commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    }
  },
  getters: {
    list(state) {
      return state.clients || null
    },
    getClient: (state) => {
      (clientId) => {
        let client = state.clients.filter( c => {
          return clientId == c.id
        })
        return client.length ? client[0] : null
      }
    }
  }
}