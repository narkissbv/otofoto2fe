<template>
<div v-observe-visibility="isInViewport"
     class="in-view-port"></div>
</template>

<script>
export default {
  data () {
    return {

    }
  },

  methods: {
    isInViewport(isVisible, entry) {
      console.log(entry)
      if (isVisible) {
        this.$emit('inviewport')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .in-view-port {
    width: auto;
    height: 1px;
  }
</style>