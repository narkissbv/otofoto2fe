<template>
  <div>
    <v-card class="pa-4">
      <v-card-title>
        Upload photos to {{ clientName || 'client' }}
      </v-card-title>
      <!-- <v-file-input
        v-model="files"
        counter
        multiple
        show-size
        prepend-icon="mdi-camera"
        accept="image/*"
        label="Upload photos"
      ></v-file-input>
      <v-btn color="primary" @click="uploadPhotos">Upload</v-btn> -->
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
export default {
  data () {
    return {
      files: [],
      dropzoneOptions: {
          url: `${API_BASE_URL}/upload.php`,
          thumbnailWidth: 150,
          maxFilesize: 1.5,
          acceptedFiles: 'image/*',
          headers: { "My-Awesome-Header": "header value" }
      }
    }
  },
  components: {
    VueDropzone: vue2Dropzone
  },
  props: [
    'clientId',
    'clientName'
  ],
  methods: {
    // uploadPhotos () {
    //   if (this.files) {
    //     let formData = new FormData()

    //     // files
    //     for (let file of this.files) {
    //       formData.append("files", file, file.name)
    //     }

    //     formData.append("clientId", this.clientId)
    //     axios.post(`${API_BASE_URL}/upload`, formData).then(resp => {
    //       console.log(resp)
    //     })
    //   }
    // }
    sendingEvent(file, xhr, formData) {
      formData.append('clientId', this.clientId)
    }
  }
}
</script>

<style>

</style>