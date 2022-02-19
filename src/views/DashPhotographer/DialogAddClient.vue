<template>
  <v-dialog
    v-model="isOpen"
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
      <v-form v-model="addClientFormValid"
              @submit="save"
              ref="addClientForm">
        <v-card-title>
          <span class="headline">New Client</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <h3>Client information</h3>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="newClient.name"
                  label="Name"
                  counter="40"
                  :rules="[validations.required]"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="newClient.phone"
                  :rules="[validations.required]"
                  type="tel"
                  label="Phone"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="newClient.email"
                  :rules="[validations.email, validations.required]"
                  type="email"
                  label="Email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mb-5"/>
            <div class="album-details">
              <h3>Album information</h3>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="newClient.albumName"
                    label="Album name"
                    counter="20"
                    :rules="[validations.albumName, validations.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="newClient.albumNumber"
                    :rules="[validations.required, validations.positive]"
                    type="number"
                    label="Number of photos"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-checkbox
                    v-model="newClient.shareable"
                    label="Enable album sharing"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

</template>

<script>
import { mapActions } from 'vuex'
import validationMixin from '@/mixins/validations'
export default {
  mixins: [validationMixin],
  data () {
    return {
      isOpen: false,
      addClientFormValid: false,
      newClient: {
        name: '',
        email: '',
        phone: '',
        albumName: '',
        albumNumber: null,
        shareable: false
      },
      newClientTemplate: {
        name: '',
        email: '',
        phone: '',
        albumName: '',
        albumNumber: null,
        shareable: false
      },
    }
  },
  methods: {
    ...mapActions({
      addClient: 'clients/addClient',
    }),
    async save () {
      this.$refs.addClientForm.validate()
      if (this.addClientFormValid) {
          await this.addClient(this.newClient)
          this.closeDialog()
      }
    },
    closeDialog () {
      this.$refs.addClientForm.resetValidation()
      this.newClient = Object.assign({}, this.newClientTemplate)
      this.isOpen = false
    },
  }
}
</script>

<style>

</style>
