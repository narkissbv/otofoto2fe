<template>
  <div>
    <v-card class="pa-4">
      <back-btn/>
      <v-card-title>
        {{ getClient.name }}'s photos
      </v-card-title>
      <v-row class="gallery-container">
        <v-col cols="12" sm="6" md="4" lg="3"
             v-for="photo in displayPhotos"
             :key="photo.id"
             class="">
          <v-card outlined>
            <div :style="`background-image: url(${getImageSrc(photo.thumb)}`"
                 class="image-container">
            </div>
            <v-divider class="my-4 mx-4"></v-divider>
            <v-row class="data mx-4 mb-4 justify-space-between">
              <v-col class="">{{ photo.filename }}</v-col>
              <v-col class="shrink">
                <v-icon @click="deletePhoto({photoId: photo.id})"
                        color="error">mdi-delete</v-icon>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <in-view-port @inviewport="loadMore"/>
    </v-card>
  </div>
</template>

<script>
import BackBtn from './backBtn'
import InViewPort from './InViewPort.vue'
import { mapActions, mapGetters } from 'vuex'
import utils from '../utils/utils'
export default {
  mixins: [utils],
  data () {
    return {
      displayPhotos: [],
      imagesPerSection: 50,
      section: 0,
    }
  },
  components: {
    BackBtn,
    InViewPort,
  },
  computed: {
    ...mapGetters({
      photos: 'photos/all',
      clients: 'clients/list',
    }),
    // getImageSrc () {
    //   return (url) => {
    //     return window.location.hostname === 'localhost' ?
    //     `http://localhost/otofoto2be/${url}` :
    //     `${window.location.origin}/${url}`
    //   }
    // },
    getClient () {
      const filteredClient = this.clients.filter( client => {
        return client.id == this.$route.params.id
      })
      return filteredClient.length ? filteredClient[0] : 'Client'
    }
  },
  methods: {
    ...mapActions({
      fetchPhotos: 'photos/fetchPhotos',
      fetchClients: 'clients/fetchClients',
      storeDelete: 'photos/delete',
    }),
    deletePhoto(payload) {
      this.storeDelete(payload).then( () => {
        this.fetchPhotos({clientId: this.id})
      })
    },
    loadMore() {
      this.displayPhotos = this.displayPhotos.concat(
        this.photos.slice(
          this.imagesPerSection * this.section, this.imagesPerSection * (this.section + 1)))
      this.section++
    },
    init () {
      // TODO: fetch by client or by album (type prop)
      switch (this.$route.meta.type) {
        case 'album':
          this.fetchPhotos({albumId: this.$route.params.id}).then( () => {
            this.displayPhotos = this.photos.slice(0,this.imagesPerSection)
          })
          break
        case 'client':
        default:
          this.fetchPhotos({clientId: this.$route.params.id}).then( () => {
            this.displayPhotos = this.photos.slice(0,this.imagesPerSection)
          })
          break
      }
      this.fetchClients()
    },
  },
  created () {
    this.init()
  },
}
</script>

<style scoped lang="scss">
  .image-container {
    height: 60vh;
    background-size: cover;
    background-position: center;
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      height: 300px;
    }
    @media #{map-get($display-breakpoints, 'md-and-up')} {
      height: 400px;
    }
  }
</style>