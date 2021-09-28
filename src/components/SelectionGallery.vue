<template>
  <div>
    <v-dialog
      v-model="active"
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
      @keydown="keysControl"
    >
      <v-card class="gallery-wrapper">
        <div class="controls">
          <div class="close">
            <v-btn icon
                   x-large
                   @click="close">
              <v-icon color="galleryIcons">mdi-close</v-icon>
            </v-btn>
          </div>
          <div class="select">
            <v-btn @click="setPhoto(imageId)"
                   icon
                   :loading="loading"
                   :color="getColor"
                   x-large>
              <v-icon>{{ isSelected(imageId) ? 'mdi-checkbox-marked-outline' :  'mdi-checkbox-blank-outline'}}</v-icon>
            </v-btn>
          </div>
          <div class="prev">
            <v-btn icon
                   x-large
                   @click="prev">
              <v-icon color="galleryIcons">mdi-chevron-left</v-icon>
            </v-btn>
          </div>
          <div class="next">
            <v-btn icon
                   x-large
                   @click="next">
              <v-icon color="galleryIcons">mdi-chevron-right</v-icon>
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
      albumId: this.$route.params.id,
      loading: false,
    }
  },
  props: {
    initImageId: {
      type: [String, Number],
      required: true
    },
    active: {
      type: Boolean,
      required: true,
    },
    photoFilter: {
      type: String,
      required: false,
    }
  },
  computed: {
    ...mapGetters({
      photos: 'photos/all'
    }),
    getImageSrc () {
      let image = this.getImages.filter( image => {
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
    getImages () {
        let filter = null
        switch (this.photoFilter) {
          case 'selected':
            filter = this.photos.selected
            break
          case 'unselected':
            filter = this.photos.unselected
            break
          case 'all':
          default:
            filter = this.photos.all
            break
        }
        return filter
    },
    getColor () {
      return this.isSelected(this.imageId) ? 'primary' : 'galleryIcons'
    },
  },
  watch: {
    initImageId: function (newVal) {
      this.imageId = newVal
    },
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
        currentIndex = this.getImages.length - 1
      } else {
        currentIndex--
      }
      let prevImage = this.getImages[currentIndex]
      this.imageId = prevImage.id
    },
    next () {
      let currentIndex = this.getImage().index
      if (currentIndex >= this.getImages.length - 1) {
        currentIndex = 0
      } else {
        currentIndex++
      }
      let nextImage = this.getImages[currentIndex]
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
      const image = this.getImages.filter(image => {
        return image.id == this.imageId
      })
      return image[0] || null
    },
    keysControl (event) {
      switch (event.keyCode) {
        case 37:
          // left
          this.prev()
          break
        case 39:
          // right
          this.next()
          break
        case 32:
          // space
          this.setPhoto(this.imageId)
          break
        case 27:
          // esc
          this.close()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .gallery-wrapper {
    backdrop-filter: blur(30px);
    background-color: rgba(0,0,0,0.5)
  }
  .controls {
    position: relative;
    height: 100vh;
    z-index: 1;
    & > div {
      position: absolute;
      // background-color: rgba(0,0,0,0.5);
      // border-radius: 50%;
    }
    .close {
      top: 10px;
      right: 10px;
    }
    .select {
      bottom: 10px;
      right: 10px;
    }
    .prev {
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    .next {
      right: 10px;
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