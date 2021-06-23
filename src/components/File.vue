<template>

<v-badge
  overlap
  bordered
  color="purple"
  style="width: 100%;"
  icon="mdi-link-variant"
  :value="!self.link.is_original"
>
  <v-card class="d-flex align-center elevation-5">
    <v-icon color="pink" class="ml-2" large>
      {{ icon }}
    </v-icon>

    <v-text-field
      v-model="self.name"
      class="file-field ma-2"
      :label="lang.views.watcher.calendar_detail_short[lg]"
      :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
      :flat="!(edit_mode && $has_xs(['watcher_is_editor']))"
      hide-details
      solo
    ></v-text-field>

    <div class="ml-1 mr-2" v-if="edit_mode">
      <CustomButton
        :icon="'mdi-arrow-split-horizontal'"
        :small_fab="true"
        :text_color="'pink'"
        :tooltip="lang.generic.update_position[lg]"
        :cursor="grab_cursor"
        @mousedown="grab_cursor = 'grabbing'"
        @mouseup="grab_cursor = 'grab'"
        @mouseleave="grab_cursor = 'grab'"
        class="handle"
      />

      <CustomButton
        :icon="'mdi-cog'"
        :small_fab="true"
        :text_color="'teal'"
        :tooltip="lang.generic.edit_options[lg]"
        :menus="edit_menus"
        @menu_action="menu_action($event)"
      />
    </div>
  </v-card>
</v-badge>

</template>


<script>

export default {
  name: '',

  components: {
    
  },

  props: {
    self: Object,
    parent: Object,
  },

  data() {
    return {
      grab_cursor: 'grab',
    }
  },

  created() {

  },

  computed: {
    edit_mode() {
      return this.$current_component.detail_edit_mode
    },

    icon() {
      return 'mdi-file'
    },

    edit_menus() {
      let delete_icon = this.self.link.is_original ? 'mdi-delete' : 'mdi-link-variant-remove'

      return [
        {
          'icon': 'mdi-content-copy',
          'name': this.lang.generic.to_copy[this.lg],
          'color': 'indigo',
          'action': 'copy',
        },
        {
          'icon': 'mdi-flip-to-front',
          'name': this.lang.generic.move[this.lg],
          'color': 'light-blue',
          'action': 'move',
        },
        {
          'icon': 'mdi-link-variant-plus',
          'name': this.lang.generic.to_link[this.lg],
          'color': 'purple',
          'action': 'link',
        },
        {
          'icon': delete_icon,
          'name': this.lang.generic.delete[this.lg],
          'color': 'red',
          'action': 'delete',
        },
      ]
    },
  },

  methods: {
    menu_action(event) {
      if (event == 'copy') {
        console.log('copy')
      }

      else if (event == 'move') {
        console.log('move')
      }

      else if (event == 'link') {
        console.log('link')
      }

      else if (event == 'delete') {
        this.delete_dialog = true
      }
    },
  },

  watch: {

  },
}

</script>


<style>

.file-field input:disabled {
  color: black !important;
}

</style>


<style scoped>

</style>
