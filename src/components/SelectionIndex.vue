<template>
  <v-card class="selection-index">
    {{ description }}
    <v-progress-linear style="margin-top: 7px" v-model="progress"></v-progress-linear>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      photos: 'photos/all',
      albums: 'albums/list',
    }),
    currentAlbum () {
      return this.albums.filter (album => {
        return album.id == this.$route.params.id
      })[0]
    },
    progress () {
      if (this.photos && this.currentAlbum) {
        return this.photos.selected.length / this.currentAlbum.photos * 100
      } else {
        return ''
      }
    },
    description () {
      if (this.currentAlbum) {
        return `Selected ${this.photos.selected.length}
                photos out of ${this.currentAlbum.photos}
                for ${this.currentAlbum.description}`
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .selection-index {
    position: fixed;
    width: 100%;
    bottom: 0;
    padding: 20px;
    @media #{map-get($display-breakpoints, 'md-and-up')} {
      bottom: auto;
      top: 100px;
      right: 100px;
      max-width: 200px;

    }
  }
</style>