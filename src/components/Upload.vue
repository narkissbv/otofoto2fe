<template>
  <div>
    <v-card class="pa-4">
    <back-btn/>
      <v-card-title>
        Upload photos to {{ clientName || 'client' }}
      </v-card-title>
      <vue-dropzone ref="myVueDropzone"
                    id="dropzone"
                    @vdropzone-sending="sendingEvent"
                    :options="dropzoneOptions">
      </vue-dropzone>
    </v-card>
  </div>
</template>

<script>
// import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { API_BASE_URL } from '../utils/utils'
import BackBtn from './backBtn.vue'
export default {
  data () {
    return {
      files: [],
      dropzoneOptions: {
          url: `${API_BASE_URL}/upload.php`,
          thumbnailWidth: 150,
          maxFilesize: 1.5,
          acceptedFiles: 'image/jpeg'
      }
    }
  },
  components: {
    VueDropzone: vue2Dropzone,
    BackBtn
  },
  props: [
    'clientId',
    'clientName'
  ],
  methods: {
    sendingEvent(file, xhr, formData) {
      formData.append('clientId', this.clientId)
    }
  }
}
</script>

<style>

</style>