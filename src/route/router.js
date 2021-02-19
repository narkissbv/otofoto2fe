import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Login from '@/components/LoginPage'
import Dashboard from '@/components/Dashboard'
import Albums from '@/components/Albums'
import store from '@/store/store'

Vue.use(VueRouter)

// const verifyAuth = (to, from, next) => {
//   // check for valid auth token
//   axios.get('/api/otofoto2be/checkAuthToken.php').then(response => {
//     // save user data to the store (in case refresh will clear the store)
//     const user = response?.data?.user || null
//     store.commit('account/setAuthUser', user)
//     // Token is valid, so continue
//     next()
//   }).catch(error => {
//     console.error(error.data)
//     // There was an error so redirect
//     store.commit('account/logout')
//     next({
//       path: '/login'
//     })
//   })
// }

const router = new VueRouter({
  routes: [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    {
      path: '/logout',
      beforeEnter: (to, from, next) => {
        const url = '/api/otofoto2be/logout.php'
        axios.get(url).then(() => {
          store.commit('account/logout')
          next({
            path: '/login'
          })
        }, (error) => {
          console.error(error.data)
        })
      }
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      meta: {
        requiresAuth: true
      },
      component: Dashboard,
      // beforeEnter: (to, from, next) => {
      //   verifyAuth(to, from, next)
      // }
    },
    {
      name: 'albums',
      path: '/albums/:id',
      meta: {
        requiresAuth: true
      },
      component: Albums,
      props: route => ({ clientId: route.params.id }),
      // beforeEnter: (to, from, next) => {
      //   verifyAuth(to, from, next)
      // }
    }
  ]
})

router.beforeEach( (to, from, next) => {
  if (to.meta.requiresAuth) {
    // check for valid auth token
    axios.get('/api/otofoto2be/checkAuthToken.php').then(response => {
      // save user data to the store (in case refresh will clear the store)
      const user = response?.data?.user || null
      store.commit('account/setAuthUser', user)
      // Token is valid, so continue
      next()
    }).catch(error => {
      console.error(error.data)
      // There was an error so redirect
      store.commit('account/logout')
      next({
        path: '/login'
      })
    })
  } else {
    next()
  }
})
export default router