<template>
  <div>
    <v-card class="pa-4">
      <v-card-title>
      <v-data-table
        :headers="headers"
        :items="albums"
        :search="search"
        :items-per-page="20"
        :item-class="rowClass"
        :footer-props="{
          'items-per-page-options': [20, 50, 100]
        }"
        class="elevation-1"
      >

      </v-data-table>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      headers: [

      ],
      search: '',
    }
  },
  computed: {
    ...mapGetters({
      albums: 'albums/list'
    }),
    rowClass () {
      return (album) => {
        album.active ? 'unlocked' : 'locked'
      }
    }
  },
  methods: {
    ...mapActions({
      fetchAlbums: 'albums/fetchAlbums'
    }),
    init() {
      this.fetchAlbums()
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>