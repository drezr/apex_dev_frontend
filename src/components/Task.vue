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
    <div
      class="task-frame"
      :class="expanded ? 'task-frame-expanded' : ''"
    >
      <v-list-group @click="expand_toggle">
        <template v-slot:activator>
          <v-list-item-title>
            <div class="d-flex align-center">
              <CustomButton
                :icon="status_icon"
                :fab="true"
                :small="true"
                :dark="true"
                :color="status_color"
                :tooltip="status_text"
                :elevation="0"
                class="mx-2"
                @click="swap_status"
                @click.native.stop
              />

              <v-textarea
                v-model="self.name"
                class="custom-field py-1 mr-2"
                :rows="1"
                auto-grow
                hide-details
                solo
                :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
                :flat="!(edit_mode && $has_xs(['watcher_is_editor']))"
                :background-color="edit_mode ? 'white' : 'transparent'"
                @input="update"
                :placeholder="lang.generic.empty_task[lg]"
                @click.native.stop
              ></v-textarea>

              <div v-if="edit_mode" class="mr-2 d-flex align-center">
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
                  @click.native.stop
                />

                <CustomButton
                  :icon="'mdi-cog'"
                  :small_fab="true"
                  :text_color="'teal'"
                  :tooltip="lang.generic.edit_options[lg]"
                  :menus="edit_menus"
                  @menu_action="menu_action($event)"
                  @click.native.stop
                />
              </div>
            </div>

          </v-list-item-title>
        </template>

        <div class="task-expension">
          <VueDraggable
            v-model="self.children"
            @change="update_children_position"
            :animation="100"
            easing="cubic-bezier(1, 0, 0, 1)"
            handle=".handle-children"
          >
            <div
              v-for="child in self.children"
              :key="child.id + $tool.gen_uid()"
            >
              <Subtask
                v-if="child.type == 'subtask'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
              />

              <Note
                v-if="child.type == 'note'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
              />

              <File
                v-if="child.type == 'file'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
              />
            </div>
          </VueDraggable>

          <div
            v-if="self.children.length == 0"
            class="pt-6 pb-9 text-center black--text"
          >
            {{ lang.generic.task_no_element[lg] }}
          </div>
        </div>
      </v-list-group>
    </div>

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
  </v-badge>
</div>

</template>

<script>

import Subtask from '@/components/Subtask.vue'
import Note from '@/components/Note.vue'
import File from '@/components/File.vue'

export default {
  name: 'Task',

  components: {
    Subtask,
    Note,
    File,
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
      expanded: false,
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

    status_color() {
      let status_color = {
        'pending': 'orange',
        'working': 'blue',
        'done': 'green',
        'canceled': 'red',
      }

      return status_color[this.self.status]
    },

    status_icon() {
      let status_icon = {
        'pending': 'mdi-timer-sand',
        'working': 'mdi-wrench',
        'done': 'mdi-check',
        'canceled': 'mdi-cancel',
      }

      return status_icon[this.self.status]
    },

    status_text() {
      let status_icon = {
        'pending': this.lang.generic.pending[this.lg],
        'working': this.lang.generic.working[this.lg],
        'done': this.lang.generic.done[this.lg],
        'canceled': this.lang.generic.canceled[this.lg],
      }

      return status_icon[this.self.status]
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

    update_children_position() {
      console.log('children position updated')
    },

    remove() {
      this.parent.children = this.parent.children.filter(
        c => c.id !== this.self.id || c.type !== this.self.type)
    },

    swap_status() {
      let status = {
        'pending': 'working',
        'working': 'done',
        'done': 'canceled',
        'canceled': 'pending',
      }

      this.self.status = status[this.self.status]
    },

    expand_toggle() {
      this.expanded = !this.expanded
    },
  },

  watch: {

  },
}

</script>


<style>

.task-frame .v-list-item {
  padding-left: 0px !important;
}

.task-frame .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
  min-width: 0px !important;
}

</style>


<style scoped>

.task-frame {
  border-radius: 5px;
  border: 1px grey solid;
  transition: border 0.2s;
}

.task-frame-expanded {
  border-radius: 8px;
  border: 4px rgba(0, 0, 0, 0.7) solid;
}

.task-expension {
  padding-top: 12px;
  border-top: 2px rgba(0, 0, 0, 0.7) solid;
}

</style>
