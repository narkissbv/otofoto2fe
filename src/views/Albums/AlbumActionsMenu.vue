<template>
  <div class="text-right">
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn dark icon v-bind="attrs" v-on="on">
          <v-icon color="primary">mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <p> album fields, note there is no name...  <br> {{album}} </p>
        <template v-for="(action, i) in activeActions(album)">
          <component
            :is="action.component"
            v-if="action.component"
            :album="album"
            :key="i"
          />
          <v-list-item v-else :key="i" @click="action.action(album)">
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
import { mapActions } from "vuex";
import DialogEditAlbum from "./DialogEditAlbum";
import DialogArchiveAlbum from "./DialogArchiveAlbum";
export default {
  props: ["album", "test"],
  data() {
    return {
      actions: [
        {
          component: DialogEditAlbum,
          //   title: 'Edit',
          //   icon: 'mdi-pencil',
        },
        {
          title: "View photos",
          icon: "mdi-image-multiple",
          action: (album) => {
            this.$router.push({
              name: "photos",
              params: {
                id: album.id,
                name: album.description,
                type: "album",
              },
            });
          },
        },
        {
          title: "Lock Album",
          icon: "mdi-lock",
          action: (album) => this.lockAlbum({ id: album.id }),
          condition: { active: true },
        },
        {
          title: "Unlock Album",
          icon: "mdi-lock-open",
          action: (album) => this.unlockAlbum({ id: album.id }),
          condition: { active: false },
        },
        {
          title: "Share Album",
          icon: "mdi-share",
          action: (album) => this.addShare({ id: album.id }),
          condition: { shareSlug: null },
        },
        {
          title: "Remove Share",
          icon: "mdi-share-off",
          action: (album) => this.removeShare({ id: album.id }),
          condition: {
            key: "shareSlug",
            value: true,
            comparison: "truthy",
          },
        },
        {
          component: DialogArchiveAlbum,
          condition: { deleted: false },
          //   title: 'Archive',
          //   icon: 'mdi-delete',
          //   color: 'error'
        },
        {
          title: "Restore",
          icon: "mdi-recycle",
          action: (album) => this.restore({ albumId: album.id }),
          condition: { deleted: true },
          color: "primary",
        },
      ],
    };
  },
  methods: {
    ...mapActions({
      removeShare: "albums/removeShare",
      restore: "albums/restore",
      addShare: "albums/addShare",
      lockAlbum: "albums/lockAlbum",
      unlockAlbum: "albums/unlockAlbum",
    }),
  },
  components: {
    DialogEditAlbum,
    DialogArchiveAlbum,
  },
  computed: {
    activeActions() { // need to change method...
      return (item) => {
        return this.actions.filter((action) => {
          if (!action.condition) {
            return true;
          } else {
            if (action.condition.comparison) {
              switch (action.condition.comparison) {
                case "truthy":
                  return !!item[action.condition.key];
              }
            } else {
              return (
                action.condition &&
                item[Object.keys(action.condition)] ===
                  Object.values(action.condition)[0]
              );
            }
          }
        });
      };
    },
  },
};
</script>