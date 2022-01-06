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
                <v-select v-model="filterActive"
                          label="Active clients"
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
          'items-per-page-options': [20, 50, 100]
        }"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>My Clients</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>

            <!-- Add new client dialog -->
            <dialog-add-client/>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="gray" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="primary" @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div class="text-right">
            <v-menu
              bottom
              left
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon color="primary">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(action, i) in actions"
                  :key="i"
                  @click="action.action(item)"
                >
                  <v-list-item-title>
                    <v-icon
                      class="mr-2"
                      :color="action.color"
                    >
                      {{ action.icon }}
                    </v-icon>
                    <span :class="`${action.color}--text`">
                      {{ action.title }}
                    </span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
        <template v-slot:no-data>
          <!-- TODO: Add empty table template -->
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import validationMixin from '@/mixins/validations'
import { navigateTo } from '@/utils/utils'
import DialogAddClient from './DialogAddClient'
export default {
  mixins: [validationMixin],
  data () {
    return {
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id'
        },
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Username',
          value: 'username'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        }
      ],
      filterActive: 'active',
      activeFilters: [
        {
          text: 'Active',
          value: 'active',
        },
        {
          text: 'Deleted',
          value: 'deleted',
        },
        {
          text: 'All',
          value: 'all',
        },
      ],
      search: '',
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        id: null,
        name: '',
        email: '',
        phone: '',
        albumName: '',
        albumNumber: null,
        password: '',
        shareable: false
      },
      // defaultItem: {
      //   id: null,
      //   name: '',
      //   email: '',
      //   phone: '',
      //   password: '',
      //   albumName: '',
      //   albumNumber: null,
      //   shareable: false
      // },
      actions: [
        {
          title: 'Edit',
          icon: 'mdi-pencil',
          action: this.editItem
        },
        {
          title: 'Albums',
          icon: 'mdi-image-album',
          action: (item) => navigateTo('albums', {
            id: item.id,
            name: item.name
          })
        },
        {
          title: 'Photos',
          icon: 'mdi-image-multiple',
          action: (item) => navigateTo('photosByClient', {
            id: item.id,
          })
        },
        {
          title: 'Upload',
          icon: 'mdi-file-upload',
          action: (item) => navigateTo('upload', {
            id: item.id,
            name: item.name,
          })
        },
        {
          title: 'View As',
          icon: 'mdi-location-enter',
          action: ''
        },
        {
          title: 'Messages',
          icon: 'mdi-email-multiple',
          action: ''
        },
        {
          title: 'Archive',
          icon: 'mdi-delete',
          action: this.deleteItem,
          color: 'error'
        },
      ],
    }
  },
  components: {
    DialogAddClient,
  },
  computed: {
    ...mapGetters({
      clients: 'clients/list'
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'New Client' : 'Edit Client'
    },
    filteredClients () {
      let filter = []
      switch (this.filterActive) {
        case 'active':
          filter = this.clients.filter (client => {
            return !client.archived
          })
          break
        case 'deleted':
          filter = this.clients.filter (client => {
            return client.archived
          })
          break
        case 'all':
        default:
          filter = this.clients
          break
      }
      return filter
    }
  },

  watch: {
    // dialog (val) {
    //   val || this.close()
    // },

    // dialogDelete (val) {
    //   val || this.closeDelete()
    // },
  },

  created () {
    this.initialize()
  },

  methods: {
    ...mapActions({
      fetchClients: 'clients/fetchClients',
      addClient: 'clients/addClient',
      editClient: 'clients/editClient'
    }),

    initialize () {
      this.fetchClients()
    },

    editItem (item) {
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.clients.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    myDebugger (something) {
      console.log(something)
    }
  },
}
</script>
