import axios from 'axios'
import router from '../route/router'
axios.defaults.withCredentials = true

// const API_BASE_URL = '/api/otofoto2be'
const API_BASE_URL = 'https://stg.otofo.to/api'

const sendAPI = (url, payload) => {
  let formData = new FormData()
  for (let key in payload) {
    formData.append(key, payload[key])
  }
  return axios.post(`${API_BASE_URL}/${url}.php`, formData)
}

const navigateTo = (name, params) => {
  router.push({ name, params})
}

const getImageSrc = (url) => {
    // return window.location.hostname === 'localhost' ?
    // `http://localhost/otofoto2be/${url}` :
    // `${window.location.origin}/${url}`
    return `${window.location.origin}/${url}`
}

export {
  API_BASE_URL,
  sendAPI,
  navigateTo,
  getImageSrc,
}

export default {
  API_BASE_URL,
  sendAPI,
  navigateTo,
  // for use in mixins
  methods: {
    navigateTo,
    getImageSrc,
  }
}
