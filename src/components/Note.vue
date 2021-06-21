<template>

<v-badge
  overlap
  bordered
  color="purple"
  style="width: 100%;"
  icon="mdi-link-variant"
  :value="!self.link.is_original"
>
  <div class="note-frame">
    <div class="d-flex">
      <v-icon class="mx-2" color="orange darken-2">mdi-chat</v-icon>

      <v-textarea
        v-model="self.value"
        class="note-textarea pa-1"
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
    </div>

    <div
      v-if="self.author"
      class="text-right orange darken-2 px-1 white--text"
    >
      <small>
        {{ by_author_on_date }}
      </small>
    </div>
  </div>
</v-badge>

</template>


<script>

// import Component from '@/components/Component.vue'

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
    update() {

    },

    remove() {

    },

    menu_action(event) {
      if (event == 'copy') {
        console.log('copy')
      }

      else if (event == 'link') {
        console.log('link')
      }

      else if (event == 'delete') {
        this.parent.children = this.parent.children.filter(
          c => c.id !== this.self.id || c.type !== this.self.type)
      }
    },
  },

  watch: {

  },
}

</script>


<style>

.note-textarea textarea:disabled {
  color: black !important;
}

</style>


<style scoped>

.note-frame {
  border-radius: 5px;
  border: 1px grey solid;
}

</style>
