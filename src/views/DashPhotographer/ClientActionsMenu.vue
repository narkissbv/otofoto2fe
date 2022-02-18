<template>
  <div class="text-right">
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark icon v-bind="attrs" v-on="on">
          <v-icon color="primary">mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <template v-for="(action, i) in actions">
          <component
              :is="action.component"
              v-if="action.component"
              :client="client"
              :key="i"
              
            />
          <v-list-item v-else :key="i" @click="action.action(client)">
            <v-list-item-title>
              <v-icon class="mr-2" :color="action.color">
                {{ action.icon }}
              </v-icon>
              <span :class="`${action.color}--text`">
                {{ action.title }}
              </span>
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </div>
</template>


<script>
import { navigateTo } from "@/utils/utils";
import DialogEditClient from "./DialogEditClient";
import DialogArchiveClient from "./DialogArchiveClient";
export default {
  props: ["client"],
  data() {
    return {
      actions: [
        {
          component: DialogEditClient,
        },
        {
          title: "Albums",
          icon: "mdi-image-album",
          action: (client) =>
            navigateTo("albums", {
              id: client.id,
              name: client.name,
            }),
        },
        {
          title: "Photos",
          icon: "mdi-image-multiple",
          action: (client) =>
            navigateTo("photosByClient", {
              id: client.id,
            }),
        },
        {
          title: "Upload",
          icon: "mdi-file-upload",
          action: (client) =>
            navigateTo("upload", {
              id: client.id,
              name: client.name,
            }),
        },
        {
          title: "View As",
          icon: "mdi-location-enter",
          action: () => {},
        },
        {
          title: "Messages",
          icon: "mdi-email-multiple",
          action: () => {},
        },
        {
          component: DialogArchiveClient,
        },
      ],
    };
  },
  components: {
    DialogEditClient,
    DialogArchiveClient,
  },
};
</script>
