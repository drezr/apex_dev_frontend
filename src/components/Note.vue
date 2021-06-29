<template>

<div>
  <div>
    <v-chip
      v-for="(teammate, i) in $get_sorted_teammates(self.teammates)"
      :key="i"
      class="mb-1 mr-1 px-2"
      small
    >
      <v-icon size="22" class="mr-2">mdi-account-circle</v-icon>

      {{ teammate }}
    </v-chip>
  </div>

  <v-badge
    overlap
    bordered
    color="purple"
    style="width: 100%;"
    icon="mdi-link-variant"
    :value="$show_link_badge"
  >
    <div class="note-frame">
      <div class="d-flex">
        <v-icon class="mx-2" color="cyan darken-2" large>mdi-chat</v-icon>

        <v-textarea
          v-model="self.value"
          class="custom-field pa-1"
          :rows="1"
          auto-grow
          hide-details
          solo
          :disabled="!(edit_mode && $has_xs(['watcher_is_editor']) && self.profile == $logged_profile.id)"
          :flat="!(edit_mode && $has_xs(['watcher_is_editor']) && self.profile == $logged_profile.id)"
          background-color="white"
          @input="update"
          :placeholder="lang.generic.empty_note[lg]"
        ></v-textarea>

        <div v-if="edit_mode" class="mx-2 d-flex align-center">
          <CustomButton
            :icon="'mdi-arrow-split-horizontal'"
            :small_fab="true"
            :text_color="'pink'"
            :tooltip="lang.generic.update_position[lg]"
            :cursor="grab_cursor"
            @mousedown="grab_cursor = 'grabbing'"
            @mouseup="grab_cursor = 'grab'"
            @mouseleave="grab_cursor = 'grab'"
            :class="$is_in_task ? 'handle-children' : 'handle'"
          />

          <CustomButton
            v-if="$is_in_task"
            :icon="'mdi-delete'"
            :small_fab="true"
            :text_color="'red'"
            :tooltip="lang.generic.delete[lg]"
            @click="delete_dialog = true"
          />

          <CustomButton
            v-else
            :icon="'mdi-cog'"
            :small_fab="true"
            :text_color="'teal'"
            :tooltip="lang.generic.edit_options[lg]"
            :menus="edit_menus"
            @menu_action="menu_action($event)"
          />
        </div>
      </div>

      <div
        v-if="self.author"
        class="text-right cyan darken-2 px-1 white--text"
      >
        <small>
          {{ by_author_on_date }}
        </small>
      </div>
    </div>
  </v-badge>

  <CustomDialog
    :open="delete_dialog"
    :width="500"
    :title_text="lang.generic.are_you_sure[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-delete'"
    :confirm_text="lang.generic.delete[lg]"
    :confirm_color="'red'"
    @cancel="delete_dialog = false"
    @confirm="remove"
  ></CustomDialog>
</div>

</template>


<script>

export default {
  name: 'Note',

  components: {
    
  },

  props: {
    self: {
      type: Object,
      required: true,
    },
    parent: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      grab_cursor: 'grab',
      delete_dialog: false,
    }
  },

  created() {

  },

  computed: {
    edit_mode() {
      return this.$current_component.detail_edit_mode
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

    by_author_on_date() {
      let txt = this.lang.generic.by_author_on_date[this.lg]
      let date = this.self.date
      let author = this.self.author

      txt = txt.replace('@@@', this.$tool.format_date(date))
      txt = txt.replace('###', author)

      return txt
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

    update() {

    },

    remove() {
      this.parent.children = this.parent.children.filter(
        c => c.id !== this.self.id || c.type !== this.self.type)
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.note-frame {
  border-radius: 5px;
  border: 1px grey solid;
}

</style>
