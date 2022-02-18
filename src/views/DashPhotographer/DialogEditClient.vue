<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on" key>
        <v-list-item-title>
          <v-icon class="mr-2">mdi-pencil</v-icon>
          <span>Edit</span>
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-form v-model="editClientFormValid" @submit="save" ref="editClientForm">
        <v-card-title>
          <span class="headline">Edit {{ editClientTemplate.name }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <h3>Client information</h3>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editClientTemplate.name"
                  label="Name"
                  counter="40"
                  :rules="[validations.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editClientTemplate.phone"
                  :rules="[validations.required]"
                  type="tel"
                  label="Phone"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editClientTemplate.email"
                  :rules="[validations.email, validations.required]"
                  type="email"
                  label="Email"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editClient.password"
                  :rules="[validations.password]"
                  type="password"
                  label="New password"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="mb-5" />
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="closeDialog"> Cancel </v-btn>
          <v-btn color="primary" type="submit"> Save </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";
import validationMixin from "@/mixins/validations";
export default {
  mixins: [validationMixin],
  data() {
    return {
      isOpen: false,
      editClientFormValid: false,
      editClientTemplate: {
        id: null,
        password: "",
        name: "",
        email: "",
        phone: "",
      },
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
      editClient: "clients/editClient",
    }),
    async save() {
      this.$refs.editClientForm.validate();
      if (this.editClientFormValid) {
        await this.editClient(this.editClientTemplate);
        this.closeDialog();
      }
    },
    closeDialog() {
      this.$refs.editClientForm.resetValidation();
      this.isOpen = false;
    },
  },
  mounted() {
    this.editClientTemplate = Object.assign({}, this.client);
  },
};
</script>

