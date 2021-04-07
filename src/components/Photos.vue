<template>
  <div>
    <v-card class="pa-4">
      <v-card-title>
        {{ clientName || 'Client' }}'s photos
      </v-card-title>
      <v-row class="gallery-container">
        <v-col cols="12" sm="6" md="4" lg="3"
             v-for="photo in photos"
             :key="photo.id"
             class="image-container">
          <img :src="getImageSrc(photo.thumb)"/>
          <div class="controls">
            <div class="controls-placer">
              <v-icon @click="deletePhoto({photoId: photo.id})"
                      large
                      color="error">mdi-delete</v-icon>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      photos: 'photos/all'
    }),
    getImageSrc () {
      return (url) => {
        return window.location.hostname === 'localhost' ?
        `http://localhost/otofoto2be/${url}` :
        url
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
      this.fetchPhotos({clientId: this.clientId})
    },
  },
  created () {
    this.init()
  },
  props: [
    'clientId',
    'clientName'
  ],
}
</script>

<style scoped lang="scss">
  .image-container {
    position: relative;
    img {
      width: 100%
    }
    .controls {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: none;
      .controls-placer {
        position: absolute;
        top: 5%;
        right: 5%;
      }
    }
  }
  .image-container:hover .controls {
    display: block;
  }
</style>