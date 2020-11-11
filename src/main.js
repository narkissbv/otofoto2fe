import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import store from './store/store'
import router from './route/router'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$store = store

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
