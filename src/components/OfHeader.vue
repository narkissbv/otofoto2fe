<template>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-layout justify-space-between align-center>
        <v-flex shrink
                class="logo"
                @click="$router.push('/dashboard')">
          <v-img
            alt="otoFoto Logo"
            contain
            src="@/assets/of-logo-full.png"
            transition="scale-transition"
          />
        </v-flex>
        <v-flex shrink>Hello {{ name }}</v-flex>
      </v-layout>
    </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      user: 'account/user'
    }),
    name () {
      return this.user?.name || 'Guest'
    }
  }
}
</script>

<style scoped lang="scss">
  .logo {
    cursor: pointer;
  }
</style>