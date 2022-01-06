<template>
  <component :is="dashboardComponent"/>
</template>

<script>
import { mapGetters } from 'vuex'
import DashClient from './DashClient'
import DashPhotographer from '@/views/DashPhotographer/DashPhotographer'
import DashAdmin from './DashAdmin'
export default {
  components: {
    DashClient,
    DashPhotographer,
    DashAdmin
  },
  computed: {
    ...mapGetters({
      user: 'account/user'
    }),
    dashboardComponent () {
      switch (this.user.type) {
        case 'photo':
          return DashPhotographer
        case 'admin':
          return DashAdmin
        case 'client':
          return DashClient
        default:
          return 4
      }
    }
  },
}
</script>
