<template>
  <div>
    <v-dialog
      v-model="active"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <div class="controls">
          <div class="close">
            <v-btn icon
                   x-large
                   @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
          <div class="select">
            <v-btn @click="setPhoto(imageId)"
                   icon
                   :color="getColor"
                   x-large>
              <v-icon>{{ isSelected(imageId) ? 'mdi-checkbox-marked-outline' :  'mdi-checkbox-blank-outline'}}</v-icon>
            </v-btn>
          </div>
          <div class="prev">
            <v-btn icon
                   x-large
                   @click="prev">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </div>
          <div class="next">
            <v-btn icon
                   x-large
                   @click="next">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="image-container">
          <div class="image"
               :style="{backgroundImage: `url(${getImageSrc})`}"></div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getImageSrc } from '../utils/utils'
export default {
  data () {
    return {
      imageId: this.initImageId,
      albumId: this.$route.params.id
    }
  },
  props: {
    initImageId: {
      type: [String, Number],
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      photos: 'photos/all'
    }),
    getImageSrc () {
      let image = this.photos.all.filter( image => {
        return image.id == this.imageId
      })
      if (image.length) {
        return getImageSrc(image[0].url)
      } else {
        return ''
      }
    },
    isSelected () {
      return (photoId) => {
        return this.photos.selected.some( p => {
          return p.id === photoId
        })
      }
    },
    getColor () {
      return this.isSelected(this.imageId) ? 'primary' : ''
    },
  },
  watch: {
    initImageId: function (newVal) {
      this.imageId = newVal
    }
  },
  methods: {
    ...mapActions({
      fetchPhotos: 'photos/fetchPhotos',
      photoSelect: 'photos/select',
      photoUnselect: 'photos/unselect',
    }),
    close () {
      this.$emit('close')
    },
    prev () {
      let currentIndex = this.getImage().index
      if (currentIndex == 0) {
        currentIndex = this.photos.all.length - 1
      } else {
        currentIndex--
      }
      let prevImage = this.photos.all[currentIndex]
      this.imageId = prevImage.id
    },
    next () {
      let currentIndex = this.getImage().index
      if (currentIndex >= this.photos.all.length - 1) {
        currentIndex = 0
      } else {
        currentIndex++
      }
      let nextImage = this.photos.all[currentIndex]
      this.imageId = nextImage.id
    },
    setPhoto(photoId) {
      this.loading = true
      if (this.isSelected(photoId)) {
        this.photoUnselect({photoId, albumId: this.albumId}).then( () => {
          this.fetchPhotos({albumId: this.albumId}).then( () => {
            this.loading = false
          });
        })
      } else {
        this.photoSelect({photoId, albumId: this.albumId}).then( () => {
          this.fetchPhotos({albumId: this.albumId}).then( () => {
            this.loading = false
          })
        })
      }
    },
    getImage () {
      const image = this.photos.all.filter(image => {
        return image.id == this.imageId
      })
      return image[0] || null
    }
  },
}
</script>

<style lang="scss" scoped>
  .controls {
    position: relative;
    height: 100vh;
    z-index: 1;
    & > div {
      position: absolute;
    }
    .close {
      top: 0;
      right: 0;
    }
    .select {
      bottom: 0;
      right: 0;
    }
    .prev {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .next {
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .image-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    .image {
      background-size: contain;
      background-position: center;
      height: 100vh;
      width: 100vw;
    }
  }
</style>