const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const NO_WHITESPACE =  /^[0-9a-zA-Z]+$/

const validationMixin = {
  methods: {
    // add methods
  },
  data: () => ({
    validations: {
      email: value => !value || EMAIL_REGEX.test(value) || 'Please enter a valid email address',      
      required: value => !!value || 'Required.',
      albumName: value => NO_WHITESPACE.test(value) || 'English letters, numbers and no special characters',
      positive: value => value >= 0 || 'Value should be positive number',
      password: value => !value || value?.length === 0 || value?.length >= 8 || 'Password too short. Use at least 8 characters',
      username: value => !value || value?.length === 0 || value?.length >= 4 || 'Username too short. Use at least 4 characters'
    }
  })
}

export default validationMixin