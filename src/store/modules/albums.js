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
    setAlbum (state, album) {
      let albums = state.albums
      let oldAlbum = albums.find(item => {
        return item.id === album.id
      })
      let index = albums.indexOf(oldAlbum)
      albums.splice(index, 1)
      albums.push(album)
      albums.sort( (a,b) => {
        return a.id - b.id
      })
      state.albums = albums
    }
  },
  actions: {
    // payload expected to be {clientId: NUmber}
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
    /*
     payload expected to be:
     {
       albumName: test7
       photos: 123
       shareable: false
       clientId: 6
     }
    */
    addAlbum (context, payload) {
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      let url = `${API_BASE_URL}/addAlbum.php`
      axios.post(url, formData).then( (resp) => {
        context.dispatch('fetchAlbums', {clientId: payload.clientId})
        context.commit('setMessage',
                        resp?.data?.message,
                        { root: true })
      }, error => {
        context.commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    },
    editAlbum (context, payload) {
      // TODO
      console.log(context, payload)
    },
    removeShare ({ commit }, payload) {
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      let url = `${API_BASE_URL}/removeShare.php`
      axios.post(url, formData).then( (resp) => {
        commit('setAlbum', resp.data.data)
      })
    },
    addShare ({ commit }, payload) {
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      let url = `${API_BASE_URL}/addShare.php`
      axios.post(url, formData).then( (resp) => {
        commit('setAlbum', resp.data.data)
      })
    },
    lockAlbum ({ commit }, payload) {
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      let url = `${API_BASE_URL}/lockAlbum.php`
      axios.post(url, formData).then( (resp) => {
        commit('setAlbum', resp.data.data)
      })
    },
  },
  getters: {
    list(state) {
      return state.albums || null
    },
  }
}
