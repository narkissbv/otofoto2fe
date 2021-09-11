<template>
  <v-container class="intro">
    <v-card class="pa-8">
      <h1>Welcome to otoFoto</h1>
      <h3>Sign up to the system to start your work</h3>

      <v-form v-model="valid"
              ref="signupForm"
              @submit="doSignup">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="name"
              required
              :rules="[validations.required]"
              label="Full name"
              prepend-icon="mdi-account-circle">
              Full Name
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="username"
              required
              :rules="[validations.required, validations.username]"
              label="Username"
              prepend-icon="mdi-account">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
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
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="password"
              required
              :rules="[validations.email]"
              label="Email"
              prepend-icon="mdi-email">
              Email
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary"
                  type="submit">
              Sign up
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col>
          <router-link to="/resetpassword">Forgot password</router-link>
        </v-col>
        <v-col>
          <router-link to="/login">Log in</router-link>
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
      valid: false,
      name: null,
      username: null,
      password: null,
      email: null
    }
  },
  methods: {
    ...mapActions({
      signup: 'account/signup'
    }),
    doSignup () {
      this.$refs.signupForm.validate()
      if (this.valid) {
        this.signup({ username: this.username, password: this.password })
      }
    }
  }
}
</script>

<style>

</style>