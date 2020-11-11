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
      axios.post(url, formData).then( () => {
        context.dispatch('fetchClients')
      }, error => {
        context.commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    },
  },
  getters: {
    list(state) {
      return state.clients || null
    },
  }
}