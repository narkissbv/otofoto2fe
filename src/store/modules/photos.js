import { sendAPI } from '@/utils/utils'

export default {
  namespaced: true,

  state: {
    photos: {
      all: [],
      selected: [],
      unselected: [],
    }
  },
  mutations: {
    setPhotos(state, photos) {
      state.photos = photos || [];
    },
  },
  actions: {
    // payload expected to be {clientId: Number}
    fetchPhotos ({ commit }, payload) {
      let p = sendAPI('getPhotos', payload)
      p.then(response => {
        const data = response?.data?.data
        data.all = data.all.map( (item, index) => {
          return {
              ...item, index
          }
        })
        data.selected = data.selected.map( (item, index) => {
          return {
              ...item, index
          }
        })
        data.unselected = data.unselected.map( (item, index) => {
          return {
              ...item, index
          }
        })
        commit('setPhotos', data)
      })
      return p
    },
    // payload expected to be {photoId: Number}
    select (context, payload) {
      payload.action = 'add'
      return sendAPI('setPhotoSelection', payload)
    },
    // payload expected to be {photoId: Number}
    unselect (context, payload) {
      payload.action = 'remove'
      return sendAPI('setPhotoSelection', payload)
    },
    // payload expected to be {photoId: Number}
    delete (context, payload) {
      // let url = `${API_BASE_URL}/deletePhoto.php`
      
      // let formData = new FormData()
      // for (let key in payload) {
      //   formData.append(key, payload[key])
      // }
      // return axios.post(url, formData)
      return sendAPI('deletePhoto', payload)
    }
  },
  getters: {
    all(state) {
      return state.photos
    },
  }

}