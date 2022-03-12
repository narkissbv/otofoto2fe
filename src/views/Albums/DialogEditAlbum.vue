 <template>
  <v-dialog v-model="isOpen" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-title>
          <v-icon class="mr-2">mdi-pencil</v-icon>
          <span>Edit</span>
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-form v-model="editAlbumFormValid" @submit="save" ref="editAlbumForm">
        <v-card-title>
          <span class="headline">
            Edit Album {{ editAlbumTemplate.name }}
          </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editAlbumTemplate.name"
                  label="Album Name"
                  counter="20"
                  :rules="[validations.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editAlbumTemplate.photos"
                  :rules="[validations.required]"
                  type="number"
                  label="Number of photos"
                ></v-text-field>
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
      editAlbumFormValid: false,
      editAlbumTemplate: {
        name: "",
        photos: null,
        shareable: false,
      },
    };
  },
  props: {
    album: {
      required: true,
    },
  },
  methods: {
    ...mapActions({
      editAlbum: "albums/editAlbum",
      setMessage: "setMessage", //should be named triggerSnakeBar
    }),

    async save() {
      this.$refs.editAlbumForm.validate();
      if (this.editAlbumFormValid) {
        await this.addAlbum(this.editAlbumTemplate);
        this.closeDialog();
      }
    },

    closeDialog() {
      this.$refs.editAlbumForm.resetValidation();
      this.isOpen = false;
    },
    mounted() {
      this.editAlbumTemplate = Object.assign({}, this.album);
    },
  },
};
</script>