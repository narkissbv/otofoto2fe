import axios from 'axios'
import { API_BASE_URL } from '@/utils/utils'

export default {
  namespaced: true,

  state: {
    photos: []
  },
  mutations: {
    setPhotos(state, photos) {
      state.photos = photos || [];
    },
  },
  actions: {
    // payload expected to be {clientId: Number}
    fetchPhotos ({ commit }, payload) {
      let url = `${API_BASE_URL}/getPhotos.php`
      
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      axios.post(url, formData).then(response => {
        commit('setPhotos', response?.data?.data)
      })
    },
    // payload expected to be {photoId: Number}
    delete (context, payload) {
      let url = `${API_BASE_URL}/deletePhoto.php`
      
      let formData = new FormData()
      for (let key in payload) {
        formData.append(key, payload[key])
      }
      return axios.post(url, formData)
    }
  },
  getters: {
    all(state) {
      return state.photos
    },
  }

}