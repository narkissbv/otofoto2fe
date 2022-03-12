<template>
  <div>
    <v-card class="pa-4">
      <back-btn />
      <v-card-title>
        <v-row justify="end">
          <v-col cols="12" md="6" xl="4">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="filterLocked"
                  label="Locked albums"
                  hide-details
                  :items="lockedFilters"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="filterActive"
                  label="Active albums"
                  hide-details
                  :items="activeFilters"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredAlbums"
        :search="search"
        :items-per-page="20"
        :item-class="rowClass"
        :footer-props="{
          'items-per-page-options': [20, 50, 100],
        }"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{ clientName(clientId) }} Albums</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <dialog-add-album />
          </v-toolbar>
        </template>

        <template v-slot:[`item.share`]="{ item }">
          <a :href="getShareLink(item)" v-if="item.shareSlug">Share Link</a>
          <span v-else>No share</span>
        </template>

        <template v-slot:[`item.selected`]="{ item }">
          <v-progress-linear
            :value="Math.floor(item.selected / item.photos)"
            height="25"
            rounded
          >
            {{ `${item.selected} / ${item.photos}` }}
          </v-progress-linear>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <album-actions-menu :album="item"></album-actions-menu>
        </template>
        <template v-slot:no-data>
          <!-- TODO: Add empty table template -->
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import backBtn from "@/components/backBtn";
import DialogAddAlbum from "./DialogAddAlbum";
import AlbumActionsMenu from "./AlbumActionsMenu";

export default {
  components: {
    backBtn,
    DialogAddAlbum,
    AlbumActionsMenu,
  },
  data() {
    return {
      search: "",
      filterLocked: "all",
      filterActive: "active",
      lockedFilters: [
        {
          text: "Unlocked",
          value: "unlocked",
        },
        {
          text: "Locked",
          value: "locked",
        },
        {
          text: "All",
          value: "all",
        },
      ],
      activeFilters: [
        {
          text: "Active",
          value: "active",
        },
        {
          text: "Deleted",
          value: "deleted",
        },
        {
          text: "All",
          value: "all",
        },
      ],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "Album Name",
          value: "description",
        },
        {
          text: "Number of photos",
          value: "photos",
        },
        {
          text: "Progress",
          value: "selected",
        },
        {
          text: "Share link",
          value: "share",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  props: [
    "clientId", // maybe just get the client
  ],
  computed: {
    ...mapGetters({
      albums: "albums/list",
      clients: "clients/list",
    }),
    getShareLink() {
      return (item) => {
        return `${window.location.origin}/shared/${item.shareSlug}`;
      };
    },
    filteredAlbums() {
      let filter = [];
      switch (this.filterActive) {
        case "active":
          filter = this.albums.filter((album) => {
            return !album.deleted;
          });
          break;
        case "deleted":
          filter = this.albums.filter((album) => {
            return album.deleted;
          });
          break;
        case "all":
        default:
          filter = this.albums;
          break;
      }
      switch (this.filterLocked) {
        case "locked":
          return filter.filter((album) => {
            return !album.active;
          });
        case "unlocked":
          return filter.filter((album) => {
            return album.active;
          });
        case "all":
        default:
          return filter;
      }
    },
    rowClass() {
      return (item) => {
        if (item.deleted) return "warning";
        else if (!item.active) return "info";
        else return "";
      };
    },
    clientName() {
      //should only get the client viewed, and set once.
      return (clientId) => {
        let client = this.clients.filter((c) => {
          return c.id == clientId;
        });
        return client.length ? `${client[0].name}'s` : `Client's`;
      };
    },
  },
  methods: {
    ...mapActions({
      fetchAlbums: "albums/fetchAlbums",
      fetchClients: "clients/fetchClients", // should fetch only one client
    }),
  },
  created() {
    this.fetchAlbums({ clientId: this.clientId });
    this.fetchClients();
  },
};
</script>
