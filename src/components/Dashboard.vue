<template>
  <component :is="dashboardComponent"/>
</template>

<script>
import { mapGetters } from 'vuex'
import DashClient from './DashClient'
import DashPhoto from './DashPhoto'
import DashAdmin from './DashAdmin'
export default {
  components: {
    DashClient,
    DashPhoto,
    DashAdmin
  },
  computed: {
    ...mapGetters({
      user: 'account/user'
    }),
    dashboardComponent () {
      switch (this.user.type) {
        case 'photo':
          return DashPhoto
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
