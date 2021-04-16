<template>
  <div>
    <v-card class="pa-4">
      <back-btn/>
      <v-card-title>
        {{ clientName || 'Client' }}'s photos
      </v-card-title>
      <v-row class="gallery-container">
        <v-col cols="12" sm="6" md="4" lg="3"
             v-for="photo in photos"
             :key="photo.id"
             class="image-container">
          <v-card height="100%"
                  outlined
                  color=""
          >
            <img :src="getImageSrc(photo.thumb)"/>
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
    </v-card>
  </div>
</template>

<script>
import BackBtn from './backBtn'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {

    }
  },
  components: {
    BackBtn,
  },
  computed: {
    ...mapGetters({
      photos: 'photos/all'
    }),
    getImageSrc () {
      return (url) => {
        return window.location.hostname === 'localhost' ?
        `http://localhost/otofoto2be/${url}` :
        `${window.location.origin}/${url}`
      }
    }
  },
  methods: {
    ...mapActions({
      fetchPhotos: 'photos/fetchPhotos',
      storeDelete: 'photos/delete',
    }),
    deletePhoto(payload) {
      this.storeDelete(payload).then( () => {
        this.fetchPhotos({clientId: this.clientId})
      })
    },
    init () {
      // TODO: fetch by client or by album (type prop)
      switch (this.type) {
        case 'client':
          this.fetchPhotos({clientId: this.id})
          break
        case 'album':
          this.fetchPhotos({albumId: this.id})
      }
    },
  },
  created () {
    this.init()
  },
  props: [
    'id',
    'clientName',
    'type',
  ],
}
</script>

<style scoped lang="scss">
  .image-container {
    position: relative;
    img {
      width: 100%
    }
  }
  .image-container:hover .controls {
    display: block;
  }
</style>