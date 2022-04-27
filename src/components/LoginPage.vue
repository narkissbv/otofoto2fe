<template>
  <v-container class="intro">
    <v-card class="pa-8">
      <h1>Welcome back to otoFoto</h1>
      <h3>Sign in to the system to start your work</h3>
      <v-form v-model="valid"
              ref="loginForm"
              @submit.prevent="doLogin">
        <v-row wrap>
          <v-col cols="12">
            <v-text-field
              v-model="username"
              required
              :rules="[validations.required, validations.username]"
              label="Username"
              prepend-icon="mdi-account">
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="password"
              required
              :rules="[validations.required]"
              type="password"
              label="Password"
              prepend-icon="mdi-key">
              Password
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary"
                  type="submit">
              Login
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col>
          <router-link to="/resetpassword">Forgot password</router-link>
        </v-col>
        <v-col>
          <router-link to="/signup">Sign up</router-link>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import validationMixin from './../mixins/validations'

export default {
  mixins: [validationMixin],
  data () {
    return {
      username: '',
      password: '',
      valid: false,
    }
  },
  methods: {
    ...mapActions({
      login: 'account/login'
    }),
    doLogin () {
      this.$refs.loginForm.validate()
      if (this.valid) {
        this.login({ username: this.username, password: this.password })
      }
    }
  },
}
</script>

<style scoped lang="stylus">

</style>