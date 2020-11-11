<template>
  <v-container>
    <h1>Welcome to otoFoto</h1>
    <h3>Sign in to the system to start your work</h3>

    <v-form v-model="valid"
            ref="loginForm"
            @submit="doLogin">
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            v-model="username"
            required
            :rules="[validations.required]"
            label="Username"
            prepend-icon="mdi-account">
            
          </v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            v-model="password"
            required
            :rules="[validations.required]"
            type="password"
            label="Password"
            prepend-icon="mdi-key">
            Password
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-btn color="primary"
                 type="submit">
            Login
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
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