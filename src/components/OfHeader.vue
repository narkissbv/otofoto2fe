<template>
    <v-app-bar
      app
      color="primary"
      dark
      style="z-index: 99"
    >
      <v-row dense justify-space-between align-center>
        <v-col class="shrink logo"
                @click="$router.push('/dashboard')">
          <v-img
            alt="otoFoto Logo"
            contain
            src="@/assets/of-logo-full.png"
            transition="scale-transition"
          />
        </v-col>
        <v-col align-self="center">Hello {{ name }}</v-col>
        <v-col align-self="center" class="shrink">
          <v-menu top
                  :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon
                     v-bind="attrs"
                     v-on="on">
                <v-icon>mdi-cog</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <v-switch v-model="$vuetify.theme.dark"
                            label="Dark theme"
                  ></v-switch>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="isLoggedin"
                           @click="logout">
                <v-list-item-title>
                  <v-icon>mdi-power</v-icon>
                  Logout
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-app-bar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      user: 'account/user',
      isLoggedin: 'account/isLoggedIn'
    }),
    name () {
      return this.user?.name || 'Guest'
    }
  },
  methods: {
    ...mapActions({
      logout: 'account/logout'
    })
  }
}
</script>

<style scoped lang="scss">
  .logo {
    cursor: pointer;
  }
</style>