import { sendAPI } from '@/utils/utils'

export default {
  namespaced: true,

  state: {
    albums: []
  },
  mutations: {
    setAlbums (state, albums) {
      state.albums = albums
    },
    /**
     * 
     * @param {*} state 
     * @param {*} album album object to update in list
     * Removes old album and inserts the new album into the list
     */
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
    // payload expected to be {clientId: Number}
    fetchAlbums ({ commit }, payload) {
      let url = 'getAlbums'
      sendAPI(url, payload).then(response => {
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
      let url = `addAlbum`
      sendAPI(url, payload).then( (resp) => {
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
      let url = `removeShare`
      sendAPI(url, payload).then( (resp) => {
        commit('setAlbum', resp.data.data)
        commit('setMessage', resp.data.message, {root: true})
      })
    },
    addShare ({ commit }, payload) {
      let url = `addShare`
      sendAPI(url, payload).then( (resp) => {
        commit('setAlbum', resp.data.data)
        commit('setMessage', resp.data.message, {root: true})
      })
    },
    lockAlbum ({ commit }, payload) {
      let url = `lockAlbum`
      sendAPI(url, payload).then( (resp) => {
        commit('setAlbum', resp.data.data)
        commit('setMessage', resp.data.message, {root: true})
      })
    },
    unlockAlbum ({ commit }, payload) {
      let url = `unlockAlbum`
      sendAPI(url, payload).then( (resp) => {
        commit('setAlbum', resp.data.data)
        commit('setMessage', resp.data.message, {root: true})
      })
    },
    delete ( context , payload) {
      let url = `deleteAlbum`
      return sendAPI(url, payload)
    },
    restore ({ commit }, payload) {
      let url = `restoreAlbum`
      sendAPI(url, payload).then( (resp) => {
        commit('setMessage',
                        resp?.data?.message,
                        { root: true })
        commit('setAlbum', resp.data.data)
      }, error => {
        commit('setErrorMessage', error?.response?.data?.message, { root: true })
      })
    },
    finish ( context, payload) {
      const url = 'finishSelection'
      const p = sendAPI(url, payload)
      p.then( resp => {
        const clientId = context.rootGetters['account/user'].userId
        context.dispatch('fetchAlbums', {clientId: clientId})
        context.commit('setMessage', resp?.data?.message, { root: true })
      })
      return p
    },
  },
  getters: {
    list(state) {
      return state.albums || null
    },
  }
}
