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
        warning: colors.yellow.lighten5,
        galleryIcons: '#fff',
        success: colors.green.lighten2,
        info: '#f4e7ff'
      },
      dark: {
        primary: colors.purple.lighten2,
        secondary: colors.grey.darken1,
        accent: colors.purple.darken4,
        error: colors.red.accent1,
        warning: '#ffff00',
        galleryIcons: '#fff',
        success: colors.green.base,
        info: '#4d3452'
      },
    },
    dark: true
  },
})

export default vuetify
