<template>
  <v-app>
    <of-header/>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-snackbar
      v-model="snackbar"
    >
      {{ error }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <nav>
      <router-link to="/">Home</router-link> | 
      <router-link to="/login">Login</router-link> |
      <router-link to="/dashboard">Dashboard</router-link> |
      <router-link to="/logout">Logout</router-link>
    </nav>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import OfHeader from './components/OfHeader'

export default {
  name: 'App',

  components: {
    OfHeader
  },
  data: () => ({
    snackbar: false
  }),
  mounted() {
    this.$store.commit('account/setAuthUser', window.auth_user)
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'account/isLoggedIn',
      error: 'error'
    })
  },
  watch: {
    error(newValue, oldValue) {
      if (newValue && newValue != oldValue && newValue.length > 0) {
        this.snackbar = true
      }
    }
  }
}
</script>
