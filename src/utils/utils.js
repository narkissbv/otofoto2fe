import axios from 'axios'

const API_BASE_URL = '/api/otofoto2be'

const sendAPI = (url, payload) => {
  let formData = new FormData()
  for (let key in payload) {
    formData.append(key, payload[key])
  }
  return axios.post(`${API_BASE_URL}/${url}.php`, formData)
}

export {
  API_BASE_URL,
  sendAPI,
}

export default {
  API_BASE_URL,
  sendAPI,
}