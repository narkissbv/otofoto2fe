import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import store from './store/store'
import router from './route/router'
import VueObserveVisibility from 'vue-observe-visibility'


Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$store = store
Vue.use(VueObserveVisibility)

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
