<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="clients"
        :items-per-page="5"
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

            <!-- Add client dialog -->
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon left>mdi-account-plus</v-icon>
                  Add client
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <h3>Client information</h3>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.name"
                          label="Name"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.email"
                          type="email"
                          label="Email"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-text-field
                          v-model="editedItem.phone"
                          type="tel"
                          label="Phone"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-divider class="mb-5"/>
                    <h3>Album information</h3>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="7"
                      >
                        <v-text-field
                          v-model="editedItem.albumName"
                          label="Album description"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="5"
                      >
                        <v-text-field
                          v-model="editedItem.albumNumber"
                          type="number"
                          label="Number of photos"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-checkbox
                          v-model="editedItem.shareable"
                          label="Enable album sharing"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
                  <v-icon color="black">mdi-dots-vertical</v-icon>
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
export default {
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
      search: '',
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        email: '',
        phone: '',
        albumName: '',
        albumNumber: null,
        shareable: false
      },
      defaultItem: {
        name: '',
        email: '',
        phone: '',
        albumName: '',
        albumNumber: null,
        shareable: false
      },
      actions: [
        {
          title: 'Edit',
          icon: 'mdi-pencil',
          action: this.editItem
        },
        {
          title: 'Albums',
          icon: 'mdi-image-album',
          action: ''
        },
        {
          title: 'Photos',
          icon: 'mdi-image-multiple',
          action: ''
        },
        {
          title: 'Upload',
          icon: 'mdi-file-upload',
          action: ''
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
      ]
    }
  },

  computed: {
    ...mapGetters({
      clients: 'clients/list'
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'New Client' : 'Edit Client'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },

    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    ...mapActions({
      fetchClients: 'clients/fetchClients',
      addClient: 'clients/addClient'
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

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      await this.addClient(this.editedItem)
      this.close()
    },

    myDebugger (something) {
      console.log(something)
    }
  },
}
</script>

<style lang="stylus" scoped>

</style>