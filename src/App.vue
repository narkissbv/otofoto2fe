<template>
  <v-app>
    <of-header/>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      {{ error }}
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="sneakbarClose"
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
    snackbar: false,
    timeout: 5000,
  }),
  mounted() {
    this.$store.commit('account/setAuthUser', window.auth_user)
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'account/isLoggedIn',
      error: 'error',
      message: 'message'
    })
  },
  methods: {
    sneakbarClose () {
      this.snackbar = false
      this.$store.commit('clearMessages', { root: true })
    }
  },
  watch: {
    error(newValue, oldValue) {
      if (newValue && newValue != oldValue && newValue.length > 0) {
        this.timeout = 5000
        this.snackbar = true
      }
    },
    message(newValue, oldValue) {
      if (newValue && newValue != oldValue && newValue.length > 0) {
        this.timeout = -1 // keep sneakbar open indefinitely
        this.snackbar = true
      }
    },
  }
}
</script>

<style lang="scss">
  @import './styles/helper.scss'
</style>