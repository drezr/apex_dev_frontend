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
    <div
      class="file-frame"
      @click="get_file(false)"
      :class="!edit_mode ? 'cursor-pointer' : ''"
    >
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

      <div
        v-if="is_image"
        class="file-mini ml-1"
        @click="get_file(true)"
      >
        <img :src="mini" />
      </div>

      <v-icon
        v-else
        color="pink"
        large
        :class="$is_in_task || $current_view != 'board' ? 'mx-2' : 'mr-2'"
        @click="get_file"
      >
        {{ icon }}
      </v-icon>

      <v-text-field
        v-model="self.name"
        class="custom-field file-input ma-2"
        :class="is_valid ? 'file-input-valid' : 'file-input-invalid'"
        :placeholder="lang.generic.file_name[lg]"
        :disabled="!(edit_mode && $is_editor)"
        :flat="!(edit_mode && $is_editor)"
        hide-details
        solo
      ></v-text-field>

      <CustomButton
        v-if="edit_mode && $is_editor && !file_loading"
        :icon="'mdi-content-save'"
        :small_fab="true"
        :text_color="'teal'"
        :tooltip="lang.generic.save[lg]"
        @click="update_name"
        :disabled="!is_valid || self.name == initial_name"
      />

      <Loader
        :size="20"
        :width="3"
        class="mx-2"
        v-if="file_loading"
      />

      <CustomButton
        v-if="edit_mode && $is_editor"
        :icon="'mdi-backup-restore'"
        :small_fab="true"
        :text_color="'blue'"
        :tooltip="lang.generic.restore[lg]"
        @click="restore_name"
        :disabled="self.name == initial_name"
      />

      <div class="ml-1 mr-2 d-flex" v-if="edit_mode && $is_editor">
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
</div>

</template>


<script>

import PhotoSwipeWrapper from '@/components/PhotoSwipeWrapper.vue'

export default {
  name: 'File',

  components: {
    PhotoSwipeWrapper,
  },

  props: {
    self: Object,
    parent: Object,
  },

  data() {
    return {
      grab_cursor: 'grab',
      delete_dialog: false,
      initial_name: '',
      file_loading: false,

      is_photoswipe_open: false,
      options: {
        index: 0
      },
    }
  },

  created() {
    this.initial_name = this.$tool.deepcopy(this.self.name)
  },

  computed: {
    edit_mode() {
      return this.$current_component.detail_edit_mode
    },

    icon() {
      let ext = this.self.extension.toLowerCase()

      if (ext == 'pdf') return 'mdi-file-pdf'
      else if (['doc', 'docx'].includes(ext)) return 'mdi-file-word'
      else if (['xls', 'xlsx'].includes(ext)) return 'mdi-file-excel'
      else if (['mp3', 'm4a', 'wav', 'wma', 'aac'].includes(ext)) {
        return 'mdi-file-video'
      }
      else if (['mp4', 'avi', 'mov', 'flv', 'mkv'].includes(ext)) {
        return 'mdi-file-music'
      }
      else if (['tiff', 'gif', 'png', 'jpg', 'jpeg'].includes(ext)) {
        return 'mdi-image'
      }

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

    is_image() {
      let img_extensions = ['jpg', 'jpeg', 'png', 'gif']

      return img_extensions.includes(this.self.extension)
    },

    is_valid() {
      var rg1 = /^[^\\/:*?"<>|]+$/
      var rg2 = /^\./

      return rg1.test(this.self.name) && !rg2.test(this.self.name)
    },

    mini() {
      let media = this.$http.media
      let dir = this.self.uid
      let ext = this.self.extension

      return `${media}${dir}/mini.${ext}`
    },

    photos() {
      if (this.is_image) {
        let media = this.$http.media
        let dir = this.self.uid
        let name = this.self.name
        let ext = this.self.extension

        let path = `${media}${dir}/${name}.${ext}`
        let mini = `${media}${dir}/mini.${ext}`

        return [{
          'title': this.self.name,
          'src': path,
          'mini': mini,
          'w': this.self.width,
          'h': this.self.height,
        }]
      }

      return Array()
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

    remove() {
      this.delete_dialog = false

      this.parent.children = this.parent.children.filter(
        c => c.id !== this.self.id || c.type !== this.self.type)
    },

    get_file(force) {
      if (!this.edit_mode || force) {
        if (!this.is_image) {
          let media = this.$http.media
          let dir = this.self.uid
          let name = this.self.name
          let ext = this.self.extension

          let path = `${media}${dir}/${name}.${ext}`
          if (ext == '') path = `${media}${dir}/${name}`

          window.open(path)
        }

        else if (this.$is_in_task) {
          this.$emit('open-image')
        }

        else {
          this.is_photoswipe_open = true
          this.$set(this.options, 'index', 0)
        }
      }
    },

    async update_name() {
      this.file_loading = true

      let data = {
        'action': 'update',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_type': this.parent.type,
        'parent_id': this.parent.id,
        'element_type': 'file',
        'element_id': this.self.id,
        'name': this.self.name,
      }

      if (this.$is_in_task) {
        data['source_type'] = this.$child_task_component.parent.type
        data['source_id'] = this.$child_task_component.parent.id
      }

      await this.$http.post('element', data)

      this.file_loading = false
      this.initial_name = this.self.name
    },

    restore_name() {
      this.self.name = this.initial_name
    },
  },

  watch: {

  },
}

</script>


<style>

.file-input-valid .v-text-field__slot input {
  color: black !important;
}

.file-input-invalid .v-text-field__slot input {
  color: red !important;
}

</style>


<style scoped>

.file-frame {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px grey solid;
  background-color: white;
}

.file-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  overflow: hidden;
  min-width: 75px;
  cursor: pointer;
}

</style>
