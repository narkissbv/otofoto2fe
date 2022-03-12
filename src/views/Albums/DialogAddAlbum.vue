 <template>
  <v-dialog v-model="isOpen" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
        <v-icon left>mdi-plus</v-icon>
        Add album
      </v-btn>
    </template>
    <v-card>
      <v-form v-model="addAlbumFormValid" @submit="save" ref="addAlbumForm">
        <v-card-title>
          <span class="headline"> New Album </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newAlbum.name"
                  label="Album Name"
                  counter="20"
                  :rules="[validations.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newAlbum.photos"
                  :rules="[validations.required]"
                  type="number"
                  label="Number of photos"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-row>
                  <v-checkbox
                    v-model="newAlbum.shareable"
                    label="Enable album sharing"
                  ></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="closeDialog"> Cancel </v-btn>
          <v-btn color="primary" text type="submit"> Save </v-btn>
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
      addAlbumFormValid: false,
      newAlbum: {
        name: "",
        photos: null,
        shareable: false,
      },
      newAlbumTemplate: {
        name: "",
        photos: null,
        shareable: false,
      },
    };
  },
  methods: {
    ...mapActions({
      addAlbum: "albums/addAlbum",
      setMessage: "setMessage", //should be named triggerSnakeBar
    }),

    async save () {
      this.$refs.addAlbumForm.validate()
      if (this.addAlbumFormValid) {
          await this.addAlbum(this.newAlbum)
          this.closeDialog()
      }
    },

    closeDialog () {
      this.$refs.addAlbumForm.resetValidation()
      this.newAlbum = Object.assign({}, this.newAlbumTemplate)
      this.isOpen = false
    },
  },
};
</script>