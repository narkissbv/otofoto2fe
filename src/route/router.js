import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Login from '@/components/LoginPage'
import Dashboard from '@/components/Dashboard'
import Albums from '@/components/Albums'
import Upload from '@/components/Upload'
// import Photos from '@/components/Photos'
import Signup from '@/components/Signup'
import AlbumSelect from '@/components/AlbumSelect'

import store from '@/store/store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Login },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'signup',
      path: '/signup',
      component: Signup
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      meta: {
        requiresAuth: true
      },
      component: Dashboard,
    },
    {
      name: 'albums',
      path: '/albums/:id',
      meta: {
        requiresAuth: true
      },
      component: Albums,
      props: route => ({
        clientId: route.params.id,
      }),
    },
    {
      name: 'shared',
      path: '/shared:slug',
      component: Albums
    },
    {
      name: 'upload',
      path: '/upload/:id',
      meta: {
        requiresAuth: true
      },
      component: Upload,
      props: route => ({
        clientId: route.params.id,
        clientName: route.params.name
      })
    },
    {
      name: 'photos',
      path: '/photos/',
      meta: {
        requiresAuth: true,
      },
      component: AlbumSelect,
      children: [
        {
          name: 'photosByAlbum',
          path: 'album/:id',
          component: AlbumSelect,
          meta: {
            type: 'album',
            requiresAuth: true,
          }
        },
        {
          name: 'photosByClient',
          path: 'client/:id',
          component: AlbumSelect,
          meta: {
            action: 'delete',
            type: 'client',
            requiresAuth: true,
          }
        }
      ],
    },
    {
      name: 'albumSelect',
      path: '/select/:id',
      meta: {
        requiresAuth: true,
        action: 'select',
        type: 'album',
      },
      component: AlbumSelect,
      props: route => ({
        albumId: route.params.id,
      })
    },
    {
      name: 'albumView',
      path: '/view/:id',
      meta: {
        requiresAuth: true,
        action: 'view',
        type: 'album',
      },
      component: AlbumSelect,
      props: route => ({
        albumId: route.params.id,
      })
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
    }).catch( ()  => {
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