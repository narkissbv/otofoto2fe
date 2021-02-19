<template>
  <div>
    <h1>Albums</h1>
    <p>{{ albums }}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {

    }
  },
  props: [
    'clientId'
  ],
  computed: {
    ...mapGetters({
      albums: 'albums/list'
    }),
  },
  methods: {
    ...mapActions({
      fetchAlbums: 'albums/fetchAlbums',
    }),
    init () {
      this.fetchAlbums({clientId: this.clientId})
    },
  },
  created () {
    this.init()
  },
  watch: {
    $route(to, from) {
      if (to != from) {
        this.init()
      }
    }
  }
}
</script>

<style>

</style>