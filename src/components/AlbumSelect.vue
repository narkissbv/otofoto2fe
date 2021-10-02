<template>
  <div>
    <v-card class="pa-4">
      <back-btn/>
      <v-card-title>
        <span v-if="action === 'select'">
          {{ `Select photos for album ${getDescription(albumId)}` }}
        </span>
        <span v-if="action === 'view'">
          {{ `Selected photos for album ${getDescription(albumId)}` }}
        </span>
        <span v-if="type === 'client'">
          {{ getClient.name }}'s photos
        </span>
      </v-card-title>
      <v-row v-if="action === 'select'">
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select v-model="photoFilter"
                    label="Show photos"
                    hide-details
                    :items="photoFilters"
                    @change="setFilter"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-btn @click="finishDialog = true"
                 color="success">
            Finish
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="type === 'client'">
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-text-field v-model="photoSearch"
                    label="Search photos"
                    hide-details
                    @input="setFilter"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="gallery-container">
        <v-col cols="12" sm="6" md="4" lg="3"
             v-for="photo in displayPhotos"
             :key="photo.id">
          <v-card outlined
                  :class="{'selected': type === 'album' && isSelected(photo.id) }">
            <div :style="`background-image: url(${getImageSrc(photo.thumb)}`"
                 @click="galleryImage = photo.id; galleryActive = true"
                 class="image-container">
            </div>
            <v-divider class="my-4 mx-4"></v-divider>
            <v-row class="data mx-4 mb-4 justify-space-between">
              <v-col class="">{{ photo.filename }}</v-col>
              <v-col class="shrink" v-if="action === 'select'">
                <v-btn @click="setPhoto(photo.id)"
                  icon
                  :loading="loading">
                  <v-icon color="primary">
                    {{ isSelected(photo.id) ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline' }}
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col class="shrink" v-if="type === 'client'">
                <v-btn @click="deletePhoto({photoId: photo.id})"
                       icon
                       :loading="loading">
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <in-view-port @inviewport="loadMore" v-if="displayPhotos.length"/>
      <selection-gallery :initImageId="galleryImage"
                         :active="galleryActive"
                         :photoFilter="photoFilter"
                         @close="galleryActive = false"/>
      <selection-index v-if="action === 'select'"/>
      <v-dialog v-model="finishDialog"
                max-width="500"
      >
        <v-card>
          <v-card-title class="text-h5">
            Finished already?
          </v-card-title>

          <v-card-text>
            <div class="" v-if="finishProgress">
              <p>Saving your selections, please wait...</p>
              <v-progress-linear indeterminate></v-progress-linear>
            </div>
            <div v-else>
              <p>Finishing selecting photos will close your
                ability to change your selections and a message
                will be sent to your photographer.</p>
              <p> Are you sure you want to finish selecting photos
                  for this album?</p>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary"
                   text
                   :disabled="finishProgress"
                   @click="finishProgress = false; finishDialog = false"
            >
              cancel 
            </v-btn>
            <v-btn
              color="primary"
              text
              :disabled="finishProgress"
              @click="finishSelection()"
            >
              Yes, finish!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import BackBtn from './backBtn'
import InViewPort from './InViewPort.vue'
import SelectionGallery from './SelectionGallery.vue'
import SelectionIndex from './SelectionIndex.vue'
import { mapGetters, mapActions } from 'vuex'
import utils, { navigateTo } from '../utils/utils'
export default {
  mixins: [utils],
  data () {
    return {
      loading: false,
      displayPhotos: [],
      imagesPerSection: 48,
      section: 0,
      galleryImage: 0,
      galleryActive: false,
      photoFilter: 'all',
      finishProgress: false,
      finishDialog: false,
      photoSearch: null,
      photoFilters: [
        {
          text: 'All',
          value: 'all',
        },
        {
          text: 'Selected',
          value: 'selected',
        },
        {
          text: 'Non-selected',
          value: 'unselected',
        }
      ],
    }
  },
  components: {
    BackBtn,
    InViewPort,
    SelectionGallery,
    SelectionIndex,
  },
  computed: {
    ...mapGetters({
      user: 'account/user',
      photos: 'photos/all',
      albums: 'albums/list',
      clients: 'clients/list'
    }),
    getClient () {
      const filteredClient = this.clients.filter( client => {
        return client.id == this.clientId
      })
      return filteredClient.length ? filteredClient[0] : 'Client'
    },
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
    },
    filter () {
      let filter = null
      if (this.action === 'view') {
        return this.photos.selected
      } else if (this.action === 'select') {
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
        // return filter
      } else if (this.type === "client") {
        // return this.photos.all
        filter = this.photos.all
      } else {
        // return []
        filter = []
      }
      // filter search
      if (this.photoSearch) {
        filter = filter.filter( photo => {
          return photo.filename.indexOf(this.photoSearch) > -1
        })
      }
      return filter
    },
    action () {
      return this.$route.meta.action
    },
    type () {
      return this.$route.meta.type
    },
    albumId () {
      if (this.$route.meta.type === 'album') {
        return this.$route.params.id
      } else {
        return false
      }
    },
    clientId () {
      if (this.$route.meta.type === 'client') {
        return this.$route.params.id
      } else {
        return false
      }
    },
  },
  props: [
    // 'albumId',
    // 'clientId',
  ],
  methods: {
    ...mapActions({
    fetchPhotos: 'photos/fetchPhotos',
    photoSelect: 'photos/select',
    photoUnselect: 'photos/unselect',
    storeDelete: 'photos/delete',
    fetchAlbums: 'albums/fetchAlbums',
    finish: 'albums/finish',
    setMessage: 'setMessage',
    fetchClients: 'clients/fetchClients',
    }),
    setPhoto(photoId) {
      this.loading = true
      if (this.isSelected(photoId)) {
        this.photoUnselect({photoId, albumId: this.albumId}).then( (resp) => {
          this.setMessage(resp.data.message)
          this.fetchPhotos({albumId: this.albumId}).then( () => {
            this.loading = false
          });
        })
      } else {
        this.photoSelect({photoId, albumId: this.albumId}).then( (resp) => {
          this.setMessage(resp.data.message)
          this.fetchPhotos({albumId: this.albumId}).then( () => {
            this.loading = false
          })
        })
      }
    },
    deletePhoto(payload) {
      this.loading = true
      this.storeDelete(payload).then( (resp) => {
        this.setMessage(resp.data.message)
        this.fetchPhotos({clientId: this.clientId}).then( () => {
          this.loading = false
          // remove the deleted photo from display
          this.displayPhotos = this.displayPhotos.filter( photo => {
            return photo.id != payload.photoId
          })
        })
      })
    },
    loadMore() {
      if (!this.filter.length) return
      this.section++
      this.displayPhotos = this.displayPhotos.concat(
        this.filter.slice(
          this.imagesPerSection * this.section, this.imagesPerSection * (this.section + 1)))
    },
    setFilter () {
      this.section = 0
      this.displayPhotos = this.filter.slice(0,this.imagesPerSection)
    },
    finishSelection () {
      this.finishProgress = true
      this.finish({albumId: this.albumId}).then( (resp) => {
        this.setMessage(resp.data.message)
        this.finishProgress = false
        this.finishDialog = false
        navigateTo('dashboard')
      })
    },
    init () {
      if (this.albumId) {
        this.fetchPhotos({albumId: this.albumId}).then( () => {
          this.displayPhotos = this.filter.slice(0,this.imagesPerSection)
        })        
        this.fetchAlbums({clientId: this.user.userId})
      } else if (this.clientId) {
        this.fetchPhotos({clientId: this.clientId}).then( () => {
          this.displayPhotos = this.filter.slice(0,this.imagesPerSection)
        })
        this.fetchClients()
      }
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