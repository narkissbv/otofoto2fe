<template>
  <div>
    <v-card class="pa-4">
      <v-row v-if="activeAlbums.length">
        <v-col cols="12" sm="6" md="5" lg="4">
          <h3>Select photos to your albums</h3>
          <v-card-text>
            <v-select v-model="albumSelect"
                      :items="activeAlbums"
                      @input="navigateTo('albumSelect', {id: albumSelect, description: getAlbum(albumSelect)['description']})"
                      label="Select an album"
            ></v-select>
          </v-card-text>
        </v-col>
      </v-row>
      <hr v-if="activeAlbums.length && inactiveAlbums.length"/>
      <v-row v-if="inactiveAlbums.length">
        <v-col cols="12" sm="6" md="5" lg="4">
          <h3>View selected photos</h3>
          <v-card-text>
            <v-select v-model="albumView"
                      :items="inactiveAlbums"
                      label="Select an album"
            ></v-select>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import utils from '../utils/utils'
export default {
  mixins: [utils],
  data () {
    return {
      albumSelect: null,
      albumView: null,
    }
  },
  computed: {
    ...mapGetters({
      albums: 'albums/list',
      user: 'account/user'
    }),
    activeAlbums () {
      return this.albums.map( album => {
        if (album.active) {
          return {
            text: album.description,
            value: album.id
          }
        }
      }).filter(Boolean)
    },
    inactiveAlbums () {
      return this.albums.map( album => {
        if (!album.active) {
          return {
            text: album.description,
            value: album.id
          }
        }
      }).filter(Boolean)
    },
    getAlbum () {
      return (id) => {
        return this.albums.filter (album => {
          return album.id === id
        })[0]
      }
    }
  },
  methods: {
    ...mapActions({
      fetchAlbums: 'albums/fetchAlbums'
    }),
    init() {
      this.fetchAlbums({clientId: this.user.userId})
    },
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>