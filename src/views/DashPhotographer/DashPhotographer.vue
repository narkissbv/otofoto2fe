<template>
  <div>
    <v-card class="pa-4">
      <v-card-title>
        <v-row class="justify-end">
          <v-col cols="12" md="6" lg="5" xl="4">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="filterActive"
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
        :items="filteredClients"
        :search="search"
        :items-per-page="20"
        :footer-props="{
          'items-per-page-options': [20, 50, 100],
        }"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>My Clients</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <dialog-add-client />
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <client-actions-menu :client="item"></client-actions-menu>
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
import DialogAddClient from "./DialogAddClient";
import ClientActionsMenu from "./ClientActionsMenu";
export default {
  data() {
    return {
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: true,
          value: "id",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Username",
          value: "username",
        },
        {
          text: "",
          value: "actions",
          sortable: false,
        },
      ],
      filterActive: "active",
      activeFilters: [
        {
          text: "Active Clients",
          value: "active",
        },
        {
          text: "Deleted Clients",
          value: "deleted",
        },
        {
          text: "All Clients",
          value: "all",
        },
      ],
      search: "",
    };
  },
  components: {
    DialogAddClient,
    ClientActionsMenu,
  },
  computed: {
    ...mapGetters({
      clients: "clients/list",
    }),
    filteredClients() {
      let filter = [];
      switch (this.filterActive) {
        case "active":
          filter = this.clients.filter((client) => {
            return !client.archived;
          });
          break;
        case "deleted":
          filter = this.clients.filter((client) => {
            return client.archived;
          });
          break;
        case "all":
        default:
          filter = this.clients;
          break;
      }
      return filter;
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    ...mapActions({
      fetchClients: "clients/fetchClients",
    }),

    initialize() {
      this.fetchClients();
    },
  },
};
</script>
