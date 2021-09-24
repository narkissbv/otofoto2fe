<template>
  <div>
    <v-card class="pa-4">
      <back-btn/>
      <v-card-title>
        {{ `Select photos for album ${getDescription(albumId)}` }}
      </v-card-title>

      <v-row class="gallery-container">
        <v-col cols="12" sm="6" md="4" lg="3"
             v-for="photo in displayPhotos"
             :key="photo.id">
          <v-card outlined
                  :class="{'selected': isSelected(photo.id) }">
            <div :style="`background-image: url(${getImageSrc(photo.thumb)}`"
                 @click="galleryImage = photo.id; galleryActive = true"
                 class="image-container">
            </div>
            <v-divider class="my-4 mx-4"></v-divider>
            <v-row class="data mx-4 mb-4 justify-space-between">
              <v-col class="">{{ photo.filename }}</v-col>
              <v-col class="shrink">
                <v-btn @click="setPhoto(photo.id)"
                  icon
                  :loading="loading">
                  <v-icon color="primary">
                    {{ isSelected(photo.id) ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <in-view-port @inviewport="loadMore"/>
      <selection-gallery :initImageId="galleryImage"
                         :active="galleryActive"
                         @close="galleryActive = false"/>
    </v-card>
  </div>
</template>

<script>
import BackBtn from './backBtn'
import InViewPort from './InViewPort.vue'
import SelectionGallery from './SelectionGallery.vue'
import { mapGetters, mapActions } from 'vuex'
import utils from '../utils/utils'
export default {
  mixins: [utils],
  data () {
    return {
      loading: false,
      displayPhotos: [],
      imagesPerSection: 50,
      section: 1,
      galleryImage: 0,
      galleryActive: false,
    }
  },
  components: {
    BackBtn,
    InViewPort,
    SelectionGallery,
  },
  computed: {
    ...mapGetters({
      user: 'account/user',
      photos: 'photos/all',
      albums: 'albums/list',
    }),
    // getImageSrc () {
    //   return (url) => {
    //     return window.location.hostname === 'localhost' ?
    //     `http://localhost/otofoto2be/${url}` :
    //     `${window.location.origin}/${url}`
    //   }
    // },
    isSelected () {
      return (photoId) => {
        return this.photos.selected.some( p => {
          return p.id === photoId
        })
      }
    },
    getDescription () {
      return (albumId) => {
        let album = this.albums.filter( album => {
          return album.id == albumId
        })
        if (album.length) {
          return album[0]?.description
        } else {
          return ''
        }
      }
    }
  },
  props: [
    'albumId',
  ],
  methods: {
    ...mapActions({
    fetchPhotos: 'photos/fetchPhotos',
    photoSelect: 'photos/select',
    photoUnselect: 'photos/unselect',
    fetchAlbums: 'albums/fetchAlbums',
    }),
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
    loadMore() {
      if (!this.photos.all.length) return
      this.displayPhotos = this.displayPhotos.concat(
        this.photos.all.slice(
          this.imagesPerSection * this.section, this.imagesPerSection * (this.section + 1)))
      this.section++
    },
    init () {
      this.fetchPhotos({albumId: this.albumId}).then( () => {
        this.displayPhotos = this.photos.all.slice(0,this.imagesPerSection)
      })
      this.fetchAlbums({clientId: this.user.userId})
    }
  },
  created () {
    this.init()
  },
}
</script>

<style scoped lang="scss">
  .selected {
    box-shadow: 0 0 15px 2px var(--v-primary-base);
  }
  .image-container {
    height: 30vh;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      height: 300px;
    }
    @media #{map-get($display-breakpoints, 'md-and-up')} {
      height: 400px;
    }
  }
</style>