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
    addAlbum (context, payload) {
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      let url = `${API_BASE_URL}/addAlbum.php`
      axios.post(url, formData).then( (resp) => {
        context.dispatch('fetchAlbums')
        context.commit('setMessage',
                        resp?.data?.message,
                        { root: true })
      }, error => {
        context.commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    },
  },
  getters: {
    list(state) {
      return state.albums || null
    },
  }
}
