<template>

<div>
  <div v-if="!['board', 'project'].includes($current_view)">
    <v-chip
      v-for="(teammate, i) in $get_sorted_teammates(self.teammates)"
      :key="i"
      class="mb-1 mr-1 pl-2 lighten-4"
      :color="teammate.color"
      small
    >
      <v-icon size="22" class="mr-2">mdi-account-circle</v-icon>

      {{ teammate.name }}
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
      <div class="d-flex align-center">
        <CustomButton
          v-if="!$is_in_task && $current_view == 'board'"
          :icon="'mdi-drag'"
          :small_fab="true"
          :text_color="'pink'"
          :tooltip="lang.generic.move[lg]"
          :cursor="grab_cursor"
          @mousedown="$set_is_grabbing(true)"
          @mouseup="$set_is_grabbing(false)"
          @mouseleave="$set_is_grabbing(false)"
          class="handle"
          @click.native.stop
        />

        <v-icon
          :class="$is_in_task || $current_view != 'board' ? 'mx-2' : 'mr-2'"
          color="cyan darken-2"
          large
        >
          mdi-chat
        </v-icon>

        <v-textarea
          v-model="self.value"
          class="custom-field pa-1"
          :rows="1"
          auto-grow
          hide-details
          solo
          :disabled="!(edit_mode && $is_editor && self.profile == $logged_profile.id)"
          :flat="!(edit_mode && $is_editor && self.profile == $logged_profile.id)"
          background-color="white"
          @input="update"
          :placeholder="lang.generic.empty_note[lg]"
        ></v-textarea>

        <div v-if="edit_mode && $is_editor" class="mx-2 d-flex align-center">
          <CustomButton
            v-if="$is_in_task || $current_view != 'board'"
            :icon="'mdi-arrow-split-horizontal'"
            :small_fab="true"
            :text_color="'pink'"
            :tooltip="lang.generic.update_position[lg]"
            :cursor="grab_cursor"
            @mousedown="$set_is_grabbing(true)"
            @mouseup="$set_is_grabbing(false)"
            @mouseleave="$set_is_grabbing(false)"
            :class="$is_in_task ? 'handle-children' : 'handle'"
          />

          <CustomButton
            v-if="$is_in_task || $current_view == 'board'"
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
        class="text-right cyan darken-2 pa-1 white--text"
      >
        <small>{{ by_author_on_date }}</small>
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
      is_updating: false,
      update_timer: null,
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
      if (!this.is_updating) {
        clearInterval(this.update_timer)
      }

      this.update_timer = setTimeout(async () => {
        let data = {
          'action': 'update',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'parent_type': this.parent.type,
          'parent_id': this.parent.id,
          'element_type': 'note',
          'element_id': this.self.id,
          'value': this.self.value,
        }

        if (this.$is_in_task) {
          data['source_type'] = this.$child_task_component.parent.type
          data['source_id'] = this.$child_task_component.parent.id
        }

        await this.$http.post('element', data)
      }, 1000)
    },

    async remove() {
      this.delete_dialog = false
      
      this.parent.children = this.parent.children.filter(
        c => c.id !== this.self.id || c.type !== this.self.type)

      if (this.$current_view == 'calendar' && ['day', 'cell'].includes(this.parent.type)) {
        let parent = this.$current_component[this.parent.type + 's'].find(
          c => c.id == this.parent.id)
        let children_except_note = this.parent.children.filter(
          c => c.type != 'call')

        if (children_except_note.length == 0) {
          parent.has_content = false
        }
      }

      let data = {
        'action': 'delete',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_type': this.parent.type,
        'parent_id': this.parent.id,
        'element_type': 'note',
        'element_id': this.self.id,
      }

      if (this.$is_in_task) {
        data['source_type'] = this.$child_task_component.parent.type
        data['source_id'] = this.$child_task_component.parent.id
      }

      await this.$http.post('element', data)
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
  background-color: white;
}

</style>
