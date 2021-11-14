<template>

<div>
  <div v-if="!['board', 'project', 'myapexproject'].includes($current_view)">
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

  <div>
    <v-chip
      v-for="(tag, i) in tags"
      :key="i"
      class="mb-1 mr-1 px-2 amber lighten-2"
      small
    >
      <b class="mr-1">{{ tag.key }}</b> {{ tag.value }}
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
                v-if="$current_view == 'board' && $is_editor"
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

              <CustomButton
                v-if="!hide_status && !is_template"
                :icon="status_icon"
                :fab="true"
                :small="true"
                :dark="true"
                :color="status_color"
                :tooltip="status_text"
                :elevation="0"
                :class="($current_view != 'board' || !$is_editor) ? 'mx-2' : 'mr-2'"
                :cursor="$is_user ? 'pointer' : 'default'"
                @click="swap_status"
                @click.native.stop
              />

              <v-textarea
                v-model="self.name"
                class="custom-field py-1 mr-2"
                :class="hide_status || is_template ? 'ml-1' : ''"
                :rows="1"
                auto-grow
                hide-details
                solo
                :disabled="!(edit_mode && $is_editor)"
                :flat="!(edit_mode && $is_editor)"
                :background-color="edit_mode ? 'white' : 'transparent'"
                @input="update"
                :placeholder="lang.generic.empty_task[lg]"
                @click.native.stop
              ></v-textarea>

              <div
                v-if="edit_mode && $is_editor"
                class="mr-2 d-flex align-center"
              >
                <CustomButton
                  v-if="$current_view != 'board'"
                  :icon="'mdi-arrow-split-horizontal'"
                  :small_fab="true"
                  :text_color="'pink'"
                  :tooltip="lang.generic.update_position[lg]"
                  :cursor="grab_cursor"
                  @mousedown="grab_cursor = 'grabbing'"
                  @mouseup="grab_cursor = 'grab'"
                  @mouseleave="grab_cursor = 'grab'"
                  @click.native.stop
                  :class="$current_view == 'project' && $current_component.selected_sort ? '' : 'handle'"
                  :disabled="$current_view == 'project' && $current_component.selected_sort ? true : false"
                />

                <CustomButton
                  v-if="$current_view != 'board'"
                  :icon="'mdi-cog'"
                  :small_fab="true"
                  :text_color="'teal'"
                  :tooltip="lang.generic.edit_options[lg]"
                  :menus="edit_menus"
                  @menu_action="menu_action($event)"
                  @click.native.stop
                />

                <CustomButton
                  v-else
                  :icon="'mdi-delete'"
                  :small_fab="true"
                  :text_color="'red'"
                  :tooltip="lang.generic.delete[lg]"
                  @click.native.stop="delete_dialog = true"
                />
              </div>
            </div>
          </v-list-item-title>
        </template>

        <div
          class="task-expension"
        >
          <VueDraggable
            v-model="self.children"
            @change="update_children_position"
            :animation="100"
            easing="cubic-bezier(1, 0, 0, 1)"
            handle=".handle-children"
          >
            <div
              v-for="(child, i) in self.children"
              :key="i"
            >
              <Input
                v-if="child.type == 'input'"
                :self="child"
                :parent="self"
                :class="i + 1 == self.children.length ? 'mb-3' : ''"
                :is_template="is_template"
              />

              <Subtask
                v-if="child.type == 'subtask'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
                :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
              />

              <Note
                v-if="child.type == 'note'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
                :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
              />

              <File
                v-if="child.type == 'file'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
                :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
                v-on:open-image="try_open_photo(child)"
              />
            </div>
          </VueDraggable>

          <div
            v-if="self.children.length == 0"
            class="pt-6 pb-9 text-center black--text"
          >
            {{ lang.generic.task_no_element[lg] }}
          </div>

          <div v-if="edit_mode && $is_editor" class="d-flex justify-space-around mb-2">
            <CustomButton
              :icon="'mdi-form-textbox'"
              :small="true"
              :color="'purple'"
              :text_color="'white'"
              :text="$mobile_breakpoint ? lang.generic.text[lg] : ''"
              :tooltip="lang.generic.add_input_tooltip[lg]"
              :menus="input_menus"
              v-on:menu_action="create_child('input', $event)"
            />

            <CustomButton
              :icon="'mdi-clipboard-check'"
              :small="true"
              :color="'green darken-1'"
              :text_color="'white'"
              :text="$mobile_breakpoint ? lang.generic.subtask[lg] : ''"
              :tooltip="lang.generic.add_subtask_tooltip[lg]"
              @click="create_child('subtask')"
            />

            <CustomButton
              :icon="'mdi-chat'"
              :small="true"
              :color="'cyan darken-2'"
              :text_color="'white'"
              :text="$mobile_breakpoint ? lang.generic.note[lg] : ''"
              :tooltip="lang.generic.add_note_tooltip[lg]"
              @click="create_child('note')"
            />

            <CustomButton
              :icon="'mdi-file'"
              :small="true"
              :color="'pink'"
              :text_color="'white'"
              :text="$mobile_breakpoint ? lang.generic.file[lg] : ''"
              :tooltip="lang.generic.add_file_tooltip[lg]"
              v-if="!is_template"
              @click="add_file()"
            />
          </div>
        </div>
      </v-list-group>

      <div 
        v-if="!expanded && self.children.length > 0"
        class="blue task-has-children"
      ></div>
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

  <PhotoSwipeWrapper
    :isOpen="is_photoswipe_open"
    :items="photos"
    :options="options"
    @close="is_photoswipe_open = false"
  ></PhotoSwipeWrapper>
</div>

</template>

<script>

import PhotoSwipeWrapper from '@/components/PhotoSwipeWrapper.vue'

import Input from '@/components/Input.vue'
import Subtask from '@/components/Subtask.vue'
import Note from '@/components/Note.vue'
import File from '@/components/File.vue'

export default {
  name: 'Task',

  components: {
    PhotoSwipeWrapper,
    Subtask,
    Note,
    File,
    Input,
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
    hide_status: {
      type: Boolean,
      required: false,
      default: false,
    },
    edit_lock: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_template: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      grab_cursor: 'grab',
      delete_dialog: false,
      expanded: false,
      is_updating: false,
      update_timer: null,

      is_photoswipe_open: false,
      options: {
        index: 0
      },
    }
  },

  created() {

  },

  computed: {
    edit_mode() {
      if (this.is_template) {
        return true
      }

      else if (this.edit_lock) {
        return this.edit_lock
      }

      return this.$current_component.detail_edit_mode
    },

    edit_menus() {
      let delete_icon = this.self.link.is_original ? 'mdi-delete' : 'mdi-link-variant-remove'

      let menus = Array()

      menus.push({
        'icon': 'mdi-content-copy',
        'name': this.lang.generic.to_copy[this.lg],
        'color': 'indigo',
        'action': 'copy',
      })

      if (!this.is_template) {
        menus.push({
          'icon': 'mdi-flip-to-front',
          'name': this.lang.generic.move[this.lg],
          'color': 'light-blue',
          'action': 'move',
        })

        menus.push({
          'icon': 'mdi-link-variant-plus',
          'name': this.lang.generic.to_link[this.lg],
          'color': 'purple',
          'action': 'link',
        })
      }

      menus.push({
          'icon': delete_icon,
          'name': this.lang.generic.delete[this.lg],
          'color': 'red',
          'action': 'delete',
        })

      return menus
    },

    input_menus() {
      return [
        {
          'icon': 'mdi-format-align-bottom',
          'name': this.lang.generic.input_short[this.lg],
          'color': 'indigo',
          'action': 'short',
        },
        {
          'icon': 'mdi-format-line-style',
          'name': this.lang.generic.input_long[this.lg],
          'color': 'purple',
          'action': 'long',
        },
        {
          'icon': 'mdi-format-text',
          'name': this.lang.generic.input_title[this.lg],
          'color': 'pink',
          'action': 'title',
        },
        {
          'icon': 'mdi-calendar',
          'name': this.lang.generic.input_date[this.lg],
          'color': 'deep-orange',
          'action': 'date',
        },
        {
          'icon': 'mdi-crosshairs-gps',
          'name': this.lang.generic.input_gps[this.lg],
          'color': 'teal',
          'action': 'gps',
        },
        {
          'icon': 'mdi-link-plus',
          'name': this.lang.generic.input_link[this.lg],
          'color': 'cyan',
          'action': 'link',
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

    tags() {
      return this.self.children.filter(c =>
        c.type == 'input' &&
        c.key && c.key.length > 0 &&
        c.value && c.value.length > 0 && 
        c.heading
      )
    },

    photos() {
      let files = this.self.children.filter(f => f.type.includes('file'))
      let extensions = ['jpg', 'jpeg', 'png', 'gif']
      let photos = files.filter(p => extensions.includes(p.extension))
      let list = Array()

      for (let photo of photos) {
        let media = this.$http.media
        let dir = photo.uid
        let name = photo.name
        let ext = photo.extension

        let path = `${media}${dir}/${name}.${ext}`
        let mini = `${media}${dir}/mini.${ext}`

        list.push({
          'title': photo.name,
          'src': path,
          'mini': mini,
          'w': photo.width,
          'h': photo.height,
        })
      }

      return list
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

    async update() {
      if (!this.is_updating) {
        clearInterval(this.update_timer)
      }

      this.update_timer = setTimeout(async () => {
        await this.$http.post('element', {
          'action': 'update',
          'type': 'task',
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'project_id': this.$current_project_id,
          'element_id': this.self.id,
          'name': this.self.name,
          'status': this.self.status,
        })
      }, 1000)
    },

    async update_children_position() {
      let children_copy = this.$tool.deepcopy(this.self.children)
      let updates = Array()

      for (let child of this.self.children) {
        child.link.position = this.self.children.indexOf(child)
      }

      for (let child of this.self.children) {
        let child_copy = children_copy.find(c => {
          return c.id == child.id && c.type == child.type
        })

        if (child_copy.link.position != child.link.position) {
          updates.push({
            'type': child.type,
            'element_id': child.id,
            'position': child.link.position
          })
        }
      }

      await this.$http.post('element', {
        'action': 'position',
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'project_id': this.$current_project_id,
        'task_id': this.self.id,
        'position_updates': updates,
      })
    },

    async remove() {
      this.delete_dialog = false

      this.parent.children = this.parent.children.filter(
        c => c.id !== this.self.id || c.type !== this.self.type)

      await this.$http.post('element', {
        'action': 'delete',
        'type': 'task',
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'project_id': this.$current_project_id,
        'element_id': this.self.id,
      })
    },

    async swap_status() {
      if (this.$is_user) {
        let status = {
          'pending': 'working',
          'working': 'done',
          'done': 'canceled',
          'canceled': 'pending',
        }

        this.self.status = status[this.self.status]

        this.update()
      }
    },

    expand_toggle() {
      this.expanded = !this.expanded
    },

    try_open_photo(file) {
      let photo_names = this.photos.map(p => p.title)
      let i = photo_names.indexOf(file.name)

      this.is_photoswipe_open = true
      this.$set(this.options, 'index', i)
    },

    async create_child(type, kind) {
      let request = await this.$http.post('element', {
        'action': 'create',
        'type': type,
        'kind': kind,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'project_id': this.$current_project_id,
        'task_id': this.self.id,
      })

      let child = request[type]
      child.type = type
      child.children = Array()

      this.self.children.push(child)
    },

    add_file() {

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
  transition: border 0.2s, border-radius 0.2s;
  background-color: white;
}

.task-frame-expanded {
  border-radius: 18px;
  border: 4px rgba(0, 0, 0, 0.7) solid;
}

.task-expension {
  border-top: 2px rgba(0, 0, 0, 0.7) solid;
  transition: padding-top .1s;
}

.task-has-children {
  width: 100%;
  height: 3px;
  margin-top: -3px;
  border-radius: 0px 0px 3px 3px;
}

</style>
