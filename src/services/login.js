import axios from 'axios'

export default {
  login: (payload) => {
    const url = '/api/otofoto2be/login.php'
    // let formData = new FormData()
    // for (let key in payload) {
    //   formData.append(key, payload[key])
    // }
    return axios.post(url, formData)
  }
}