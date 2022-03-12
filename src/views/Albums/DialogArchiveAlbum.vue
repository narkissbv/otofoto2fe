<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-title class="error--text">
          <v-icon class="mr-2" color="error">mdi-delete</v-icon>
          <span>Archive</span>
        </v-list-item-title>
      </v-list-item>
    </template>

    <v-card>
      <v-card-title class="headline"
        >Are you sure you want to delete this item?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="confirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isOpen: false,
    };
  },
  props: {
    album: {
      required: true,
    },
  },
  methods: {
    ...mapActions({
      deleteAlbum: "albums/delete", // archiveAlbum: "albums/archiveAlbum"
      setMessage: "setMessage", //should be triggerSnakeBar
    }),
    confirm() {
      this.deleteAlbum({ id: this.album.id }).then((resp) => {
        this.setMessage(resp.data.message);
      });
      this.closeDialog();
    },
    closeDialog() {
      this.isOpen = false;
    },
  },
};
</script>