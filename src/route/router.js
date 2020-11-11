import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Login from '@/components/LoginPage'
import Dashboard from '@/components/Dashboard'
import store from '@/store/store'

Vue.use(VueRouter)

const guard = (to, from, next) => {
  // check for valid auth token
  axios.get('/api/otofoto2be/checkAuthToken.php').then(response => {
    console.log(response.data)
    // save user data to the store (in case refresh will clear the store)
    const user = response?.data?.user || null
    store.commit('account/setAuthUser', user)
    // Token is valid, so continue
    next()
  }).catch(error => {
    console.log(error.data)
    // There was an error so redirect
    store.commit('account/logout')
    next({
      path: '/login'
    })
  })
}

const router = new VueRouter({
  routes: [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    {
      path: '/logout',
      beforeEnter: (to, from, next) => {
        const url = '/api/otofoto2be/logout.php'
        axios.get(url).then(resp => {
          console.log(resp.data)
          store.commit('account/logout')
          next({
            path: '/login'
          })
        }, (error) => {
          console.log(error.data)
        })
      }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        guard(to, from, next)
      }
    }
  ]
})

export default router