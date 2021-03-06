<template>

<div :class="self.disabled ? 'task-disabled' : ''">
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
      v-if="!$current_component.simplified || $current_component.simplified == false"
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
                @input="update()"
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
                  v-if="$current_view == 'project'"
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
                :is_template="is_template"
              />

              <Note
                v-if="child.type == 'note'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
                :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
                :is_template="is_template"
              />

              <File
                v-if="child.type == 'file'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
                :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
                v-on:open-image="try_open_photo(child)"
              />

              <Code
                v-if="child.type == 'code'"
                :self="child"
                :parent="self"
                class="mx-3 mb-3"
                :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
                :is_template="is_template"
              />
            </div>
          </VueDraggable>

          <div
            v-if="self.children.length == 0 && !add_child_loading"
            class="pt-6 pb-9 text-center black--text"
          >
            {{ lang.generic.task_no_element[lg] }}
          </div>

          <Loader :size="50" :width="7" class="my-3" v-if="add_child_loading" />

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
              :disabled="add_child_loading"
            />

            <CustomButton
              :icon="'mdi-clipboard-check'"
              :small="true"
              :color="'green darken-1'"
              :text_color="'white'"
              :text="$mobile_breakpoint ? lang.generic.subtask[lg] : ''"
              :tooltip="lang.generic.add_subtask_tooltip[lg]"
              @click="create_child('subtask')"
              :disabled="add_child_loading"
            />

            <CustomButton
              :icon="'mdi-chat'"
              :small="true"
              :color="'cyan darken-2'"
              :text_color="'white'"
              :text="$mobile_breakpoint ? lang.generic.note[lg] : ''"
              :tooltip="lang.generic.add_note_tooltip[lg]"
              @click="create_child('note')"
              :disabled="add_child_loading"
            />

            <CustomButton
              :icon="'mdi-file'"
              :small="true"
              :color="'pink'"
              :text_color="'white'"
              :text="$mobile_breakpoint ? lang.generic.file[lg] : ''"
              :tooltip="lang.generic.add_file_tooltip[lg]"
              v-if="!is_template"
              @click="$refs['file-input'].click()"
              :disabled="add_child_loading"
            />
          </div>
        </div>
      </v-list-group>

      <div 
        v-if="!expanded && self.children.length > 0"
        class="blue task-has-children"
      ></div>
    </div>

    <div
      v-else
      class="task-frame"
      :class="expanded ? 'task-frame-expanded' : ''"
    >
      <div class="d-flex align-center">
        <span
          class="mdi mdi-drag mdi-24px handle pink--text"
          @mousedown="$set_is_grabbing(true)"
          @mouseup="$set_is_grabbing(false)"
          @mouseleave="$set_is_grabbing(false)"
          :style="`cursor : ${grab_cursor};`"
          v-if="edit_mode && $is_editor"
        ></span>

        <span
          @click="swap_status()"
          class="mdi cursor-pointer mr-1"
          :class="[
            status_icon,
            status_color + '--text',
          ]"
        ></span>

        <textarea
          v-model="self.name"
          class="task-simple-textarea hide-scrollbar"
          :disabled="!(edit_mode && $is_editor)"
          :style="autoresize()"
          @input="update()"
          no-resize
          ref="textarea"
        ></textarea>

        <span
          class="mdi mdi-delete handle red--text cursor-pointer"
          @click="delete_dialog = true"
          v-if="edit_mode && $is_editor"
        ></span>

        <span
          class="mdi grey--text cursor-pointer mx-1"
          :class="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          @click="expanded = !expanded"
        ></span>
      </div>

      <!-- TO DO remove code duplication -->

      <div
        class="task-expension"
        v-if="expanded"
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
              :is_template="is_template"
            />

            <Note
              v-if="child.type == 'note'"
              :self="child"
              :parent="self"
              class="mx-3 mb-3"
              :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
              :is_template="is_template"
            />

            <File
              v-if="child.type == 'file'"
              :self="child"
              :parent="self"
              class="mx-3 mb-3"
              :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
              v-on:open-image="try_open_photo(child)"
            />

            <Code
              v-if="child.type == 'code'"
              :self="child"
              :parent="self"
              class="mx-3 mb-3"
              :class="(self.children[i - 1] && self.children[i - 1].type == 'input') || i == 0 ? 'mt-3' : ''"
              :is_template="is_template"
            />
          </div>
        </VueDraggable>

        <div
          v-if="self.children.length == 0 && !add_child_loading"
          class="pt-6 pb-9 text-center black--text"
        >
          {{ lang.generic.task_no_element[lg] }}
        </div>

        <Loader :size="50" :width="7" class="my-3" v-if="add_child_loading" />

        <div
          v-if="edit_mode && $is_editor"
          class="d-flex justify-space-around mb-2"
        >
          <CustomButton
            :icon="'mdi-form-textbox'"
            :small="true"
            :color="'purple'"
            :text_color="'white'"
            :text="$mobile_breakpoint ? lang.generic.text[lg] : ''"
            :tooltip="lang.generic.add_input_tooltip[lg]"
            :menus="input_menus"
            v-on:menu_action="create_child('input', $event)"
            :disabled="add_child_loading"
          />

          <CustomButton
            :icon="'mdi-clipboard-check'"
            :small="true"
            :color="'green darken-1'"
            :text_color="'white'"
            :text="$mobile_breakpoint ? lang.generic.subtask[lg] : ''"
            :tooltip="lang.generic.add_subtask_tooltip[lg]"
            @click="create_child('subtask')"
            :disabled="add_child_loading"
          />

          <CustomButton
            :icon="'mdi-chat'"
            :small="true"
            :color="'cyan darken-2'"
            :text_color="'white'"
            :text="$mobile_breakpoint ? lang.generic.note[lg] : ''"
            :tooltip="lang.generic.add_note_tooltip[lg]"
            @click="create_child('note')"
            :disabled="add_child_loading"
          />

          <CustomButton
            :icon="'mdi-file'"
            :small="true"
            :color="'pink'"
            :text_color="'white'"
            :text="$mobile_breakpoint ? lang.generic.file[lg] : ''"
            :tooltip="lang.generic.add_file_tooltip[lg]"
            v-if="!is_template"
            @click="$refs['file-input'].click()"
            :disabled="add_child_loading"
          />

          <CustomButton
            :icon="'mdi-calendar-month'"
            :small="true"
            :color="'indigo '"
            :text_color="'white'"
            :text="$mobile_breakpoint ? lang.generic.code_cats[lg] : ''"
            :tooltip="lang.generic.add_cats_tooltip[lg]"
            v-if="!is_template && $is_staff"
            @click="create_child('code')"
            :disabled="add_child_loading"
          />
        </div>
      </div>

      <div 
        v-if="!expanded && self.children.length > 0"
        class="blue task-has-children"
      ></div>
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

  <PhotoSwipeWrapper
    :isOpen="is_photoswipe_open"
    :items="photos"
    :options="options"
    @close="is_photoswipe_open = false"
  ></PhotoSwipeWrapper>

  <input type="file"
    class="d-none"
    ref="file-input"
    v-on:change="add_file($event)"
  />
</div>

</template>

<script>

import PhotoSwipeWrapper from '@/components/PhotoSwipeWrapper.vue'

import Input from '@/components/Input.vue'
import Subtask from '@/components/Subtask.vue'
import Note from '@/components/Note.vue'
import File from '@/components/File.vue'
import Code from '@/components/Code.vue'

export default {
  name: 'Task',

  components: {
    PhotoSwipeWrapper,
    Subtask,
    Note,
    File,
    Input,
    Code,
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
      add_child_loading: false,

      is_photoswipe_open: false,
      options: {
        index: 0
      },
    }
  },

  created() {
    if (!this.self.status) {
      this.self.status = 'pending'
    }
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

/*        menus.push({
          'icon': 'mdi-link-variant-plus',
          'name': this.lang.generic.to_link[this.lg],
          'color': 'purple',
          'action': 'link',
        })*/
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
        this.$store.commit('set_copying_element', this.self)
      }

      else if (event == 'move') {
        this.$store.commit('set_moving_element', this.self)

        if (this.$current_view == 'project') {
          this.$store.commit('set_moving_old_parent', this.$current_component.project)
        }
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
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'parent_type': this.parent.type,
          'parent_id': this.parent.id,
          'element_type': 'task',
          'element_id': this.self.id,
          'name': this.$is_user && !this.$is_editor ? null : this.self.name,
          'status': this.self.status,
        })
      }, 1000)
    },

    async update_children_position() {
      let position_updates = this.$set_position_updates(this.self)

      await this.$http.post('element', {
        'action': 'position',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_type': this.parent.type,
        'parent_id': this.parent.id,
        'element_type': 'task',
        'element_id': this.self.id,
        'position_updates': position_updates,
      })
    },

    async remove() {
      this.delete_dialog = false

      let ce = this.$store.state.copying_element
      let me = this.$store.state.moving_element

      if ((ce && ce.id == this.self.id && ce.type == this.self.type) || (me && me.id == this.self.id && me.type == this.self.type)) {
        this.$store.commit('set_copying_element', null)
        this.$store.commit('set_moving_element', null)
      }

      this.parent.children = this.parent.children.filter(
        c => c.id !== this.self.id || c.type !== this.self.type)

      this.$remove_tag_from_day_cell()

      await this.$http.post('element', {
        'action': 'delete',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_type': this.parent.type,
        'parent_id': this.parent.id,
        'element_type': 'task',
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

        if (!this.self.status) {
          this.self.status = 'pending'
        }

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
      this.add_child_loading = true

      let request = await this.$http.post('element', {
        'action': 'create',
        'element_type': type,
        'kind': kind,
        'view': this.$current_view,
        'source_type': this.parent.type,
        'source_id': this.parent.id,
        'parent_type': this.self.type,
        'parent_id': this.self.id,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
      })

      this.add_child_loading = false

      let child = request[type]
      child.children = Array()

      this.self.children.push(child)

      setTimeout(() => {
        this.update_children_position()
      }, 100)
    },

    add_file(e) {
      this.add_child_loading = true

      this.$tool.get_file_data(e, async (data) => {
        data.append('action', 'create')
        data.append('element_type', 'file')
        data.append('kind', 'task_file')
        data.append('view', this.$current_view)
        data.append('source_type', this.parent.type)
        data.append('source_id', this.parent.id)
        data.append('parent_type', this.self.type)
        data.append('parent_id', this.self.id)
        data.append('team_id', this.$current_team_id)
        data.append('app_id', this.$current_app_id)

        let request = await this.$http.post('element', data)

        this.add_child_loading = false

        let child = request['file']
        child.children = Array()

        this.self.children.push(child)
      })
    },

    autoresize() {
      this.$nextTick(() => {
        if (this.$refs['textarea']) {
          let textarea = this.$refs['textarea']

          if (textarea) {
            textarea.style.height = `5px`
            textarea.style.height = `${textarea.scrollHeight}px`
          }
        }
      })
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

.task-disabled {
  opacity: 0.3;
  pointer-events: none;
  transition: opacity 0.2s;
}

.task-simple-textarea {
  flex-grow: 1;
  padding: 3px;
  font-size: 14px;
  resize: none;
  padding: 3px;
  margin-top: 1px;
}

.task-simple-textarea:disabled {
  color: black;
}



</style>
