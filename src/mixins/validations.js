const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const NO_WHITESPACE =  /^[0-9a-zA-Z]+$/

const validationMixin = {
  methods: {
    // add methods
  },
  data: () => ({
    validations: {
      email: value => EMAIL_REGEX.test(value) || 'Please enter a valid email address',      
      required: value => !!value || 'Required.',
      albumName: value => NO_WHITESPACE.test(value) || 'English letters, numbers and no special characters',
      positive: value => value >= 0 || 'Value should be positive number'
    }
  })
}

export default validationMixin