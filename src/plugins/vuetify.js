import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: colors.purple.lighten3,
        secondary: colors.grey.darken1,
        accent: colors.purple.lighten5,
        error: colors.red.accent3,
        warning: colors.pink.lighten5,
        info: '#f4e7ff'
      },
      dark: {
        primary: colors.purple.lighten2,
        secondary: colors.grey.darken1,
        accent: colors.purple.darken4,
        error: colors.red.accent1,
        warning: '#421b30',
        info: '#4d3452'
      },
    },
    dark: true
  },
})

export default vuetify
