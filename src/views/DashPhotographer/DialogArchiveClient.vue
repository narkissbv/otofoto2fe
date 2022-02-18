<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on" :key="key">
        <v-list-item-title class="error--text">
          <v-icon class="mr-2" color="error">mdi-archive</v-icon>
          <span>Archive</span>
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title class="headline justify-center text-center text-break mb-2">
        Are you sure you want to archive {{ client.name }}?
      </v-card-title>

      <v-card-text class="text-center">
        <v-icon class="mr-1" color="warning">mdi-alert</v-icon>
        Archived clients are deleted after 6 months
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="gray" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="confirm">OK</v-btn>
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
    client: {
      required: true,
    },
    key: {
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