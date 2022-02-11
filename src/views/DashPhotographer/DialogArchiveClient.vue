<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item-title v-bind="attrs" v-on="on" class="py-4">
        <v-icon class="mr-2" color="error">mdi-archive</v-icon>
        <span>Archive</span>
      </v-list-item-title>
    </template>
    <v-card>
      <v-card-title class="headline justify-center text-center">
        Are you sure you want to archive
        <br>{{ client.name }}?
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="confirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-spacer></v-spacer>
      <v-list-item-subtitle class="error--text">
         Archived clients are deleted after 6 months
      </v-list-item-subtitle>
      <v-spacer></v-spacer>
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
    client: {
      required: true,
    },
  },
  methods: {
    ...mapActions({
      archiveClient: "clients/archiveClient",
    }),
    confirm() {
      this.archiveClient({ clientId: this.client.id });
      this.closeDialog();
    },
    closeDialog() {
      this.isOpen = false;
    },
  },
};
</script>