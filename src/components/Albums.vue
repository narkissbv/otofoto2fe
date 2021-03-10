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
        :items="albums"
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
            <v-toolbar-title>{{ clientName || 'Client' }} Albums</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-spacer></v-spacer>

            <!-- Add / Edit client dialog -->
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
                  <v-icon left>mdi-plus</v-icon>
                  Add album
                </v-btn>
              </template>
              <v-card>
                <v-form v-model="addAlbumFormValid"
                        @submit="save"
                        ref="addAlbumForm">
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.albumName"
                            label="Album Name"
                            counter="20"
                            :rules="[validations.required]"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            v-model="editedItem.photos"
                            :rules="[validations.required]"
                            type="number"
                            label="Number of photos"
                          ></v-text-field>
                        </v-col>
                        <v-col v-if="editedIndex === -1">
                          <v-row>
                            <v-checkbox
                              v-model="editedItem.shareable"
                              label="Enable album sharing"
                            ></v-checkbox>
                          </v-row>
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
                      type="submit"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1"
                         text
                         @click="closeDelete"
                  >Cancel</v-btn>
                  <v-btn color="blue darken-1"
                         text
                         @click="deleteItemConfirm"
                  >OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:[`item.share`]="{ item }">
          <a :href="getShareLink(item)" v-if="item.shareSlug">Share Link</a>
          <span v-else>No share</span>
        </template>

        <template v-slot:[`item.selected`]="{ item }">
          <!-- <div class="progress-container">
            <div class="progress" :style="`width: ${Math.floor(item.selected / item.photos)}%`"></div>
          </div> -->
          <v-progress-linear :value="Math.floor(item.selected / item.photos)"
                             height="25"
                             rounded
          >
            {{ `${item.selected} / ${item.photos}` }}
          </v-progress-linear>
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
                  v-for="(action, i) in activeActions(item)"
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
import validationMixin from './../mixins/validations'
export default {
  mixins: [validationMixin],
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id'
        },
        {
          text: 'Album Name',
          value: 'description'
        },
        {
          text: 'Number of photos',
          value: 'photos'
        },
        {
          text: 'Progress',
          value: 'selected'
        },
        {
          text: 'Share link',
          value: 'share'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        }
      ],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        albumName: '',
        photos: null,
        shareable: false
      },
      actions: [
        {
          title: 'Edit',
          icon: 'mdi-pencil',
          action: this.editItem
        },
        {
          title: 'View photos',
          icon: 'mdi-image-multiple',
          action: (item) => {
           this.$router.push({ name: 'photos', params: {
             id: item.id,
             name: item.description
           }}) 
          }
        },
        {
          title: 'Lock Album',
          icon: 'mdi-lock',
          action: '',
          condition: {active: true}
        },
        {
          title: 'Unlock Album',
          icon: 'mdi-lock-open',
          action: '',
          condition: {active: false}
        },
        {
          title: 'Share Album',
          icon: 'mdi-share',
          action: '',
          condition: {shareSlug: null}
        },
        {
          title: 'Remove Share',
          icon: 'mdi-share-off',
          action: (item) => this.removeShare({id: item.id}),
          condition: {
            key: 'shareSlug',
            value: true,
            comparison: 'truthy'
          }
        },
        {
          title: 'Delete',
          icon: 'mdi-delete',
          action: this.deleteItem,
          color: 'error'
        },
      ],
      addAlbumFormValid: false
    }
  },
  props: [
    'clientId',
    'clientName'
  ],
  computed: {
    ...mapGetters({
      albums: 'albums/list',
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'New Album' : 'Edit Album'
    },
    getShareLink () {
      return (item) => {
        return `${window.location.origin}/shared/${item.shareSlug}`
      }
    },
    activeActions () {
      return item => {
        return this.actions.filter( action => {
          if (!action.condition) {
            return true
          } else {
            if (action.condition.comparison) {
              switch (action.condition.comparison) {
                case 'truthy':
                  return !!item[action.condition.key]
              }
            } else {
              return action.condition && item[Object.keys(action.condition)] === Object.values(action.condition)[0]
            }
          }
        })
      }
    }
  },
  methods: {
    ...mapActions({
      fetchAlbums: 'albums/fetchAlbums',
      addAlbum: 'albums/addAlbum',
      editAlbum: 'albums/editAlbum',
      removeShare: 'albums/removeShare',
    }),
    init () {
      this.fetchAlbums({clientId: this.clientId})
    },

    editItem (item) {
      this.editedIndex = this.albums.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.albums.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.albums.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$refs.addAlbumForm.resetValidation()
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
      this.$refs.addAlbumForm.validate()
      if (this.addAlbumFormValid) {
        if (this.editedIndex === -1) {
          await this.addAlbum({...this.editedItem, clientId: this.clientId})
          this.close()
        } else {
          await this.editAlbum({...this.editedItem, clientId: this.clientId})
          this.close()
        }
      }
    },
  },
  created () {
    this.init()
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  }
}
</script>

<style scoped lang="sass">
  // .progress-container
  //   width: 100%
  //   border: 1px solid black
  //   height: 10px
  //   .progress
  //     height: 100%
  //     background-color: purple
</style>