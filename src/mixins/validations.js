const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const validationMixin = {
  methods: {
    // add methods
  },
  data: () => ({
    validations: {
      email: value => EMAIL_REGEX.test(value) || 'Please enter a valid email address',      
      required: value => !!value || 'Required.',
    }
  })
}

export default validationMixin