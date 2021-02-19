import axios from 'axios'

const API_BASE_URL = '/api/otofoto2be'

export default {
  namespaced: true,

  state: {
    albums: []
  },
  mutations: {
    setAlbums (state, albums) {
      state.albums = albums
    },
  },
  actions: {
    fetchAlbums ({ commit }, payload) {
      let url = `${API_BASE_URL}/getAlbums.php`
      
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      axios.post(url, formData).then(response => {
        commit('setAlbums', response?.data?.albums)
      })
    },
  },
  getters: {
    list(state) {
      return state.albums || null
    },
  }
}
