import axios from 'axios'

const API_BASE_URL = '/api/otofoto2be'

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
      let url = `${API_BASE_URL}/getClients.php`
      axios.post(url).then(response => {
        commit('setClients', response?.data?.clients)
      })
    },
    addClient (context, payload) {
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      let url = `${API_BASE_URL}/addClient.php`
      axios.post(url, formData).then( (resp) => {
        context.dispatch('fetchClients')
        context.commit('setMessage',
          `${resp.data.message} Username: ${resp.data.data.username} Password: ${resp.data.data.password}`,
        { root: true })
      }, error => {
        context.commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    },
    editClient ({ commit }, payload) {
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      let url = `${API_BASE_URL}/editClient.php`
      axios.post(url, formData).then( (response) => {
        commit('updateClient', response.data)
      }, error => {
        commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    }
  },
  getters: {
    list(state) {
      return state.clients || null
    },
  }
}