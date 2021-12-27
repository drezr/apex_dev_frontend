<template>
 
<div class="call-frame">
  <div class="blue lighten-4 d-flex">
    <v-icon class="mx-2" color="indigo">mdi-hammer-screwdriver</v-icon>

    <input
      class="call-input call-name"
      v-model="self.name"
      :disabled="!(edit_mode && $is_editor)"
      :placeholder="lang.views.watcher.call_name[lg]"
      @input="update"
    />

    <input
      class="call-input call-kind"
      v-model="self.kind"
      :disabled="!(edit_mode && $is_editor)"
      :placeholder="lang.views.watcher.call_kind[lg]"
      @input="update"
    />
  </div>

  <div class="d-flex">
    <input
      class="call-input call-hour"
      v-model="self.start"
      :disabled="!(edit_mode && $is_editor)"
      :placeholder="lang.generic.start[lg]"
      @input="update"
    />

    <input
      class="call-input call-hour"
      v-model="self.end"
      :disabled="!(edit_mode && $is_editor)"
      :placeholder="lang.generic.end[lg]"
      @input="update"
    />

    <div class="call-calc">
      {{ hour_calc_default }}
    </div>

    <div class="call-calc">
      {{ hour_calc_decimal }}
    </div>
  </div>

  <v-divider></v-divider>

  <v-textarea
    v-model="self.description"
    class="call-description custom-field pa-1"
    :rows="1"
    auto-grow
    hide-details
    solo
    :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
    :flat="!(edit_mode && $has_xs(['watcher_is_editor']))"
    background-color="white"
    @input="update"
    :placeholder="lang.views.watcher.call_description[lg]"
  ></v-textarea>

  <v-divider class="mb-1" v-if="d27_file || d27_link.id"></v-divider>

  <div class="call-commands">
    <div v-if="!add_child_loading">
      <!-- D27 file -->

      <CustomButton
        v-if="d27_file && !edit_mode"
        :text="'D27'"
        :icon="'mdi-file-pdf'"
        :color="'black'"
        :dark="true"
        :tooltip="lang.views.watcher.call_download_d27[lg]"
        class="mx-1 mb-1"
        @click="get_file()"
      />

      <CustomButton
        v-if="edit_mode"
        :text="'D27'"
        :icon="d27_file ? 'mdi-refresh' : 'mdi-upload'"
        :color="d27_file ? 'teal' : 'blue'"
        :dark="true"
        :tooltip="d27_file ? lang.views.watcher.call_replace_d27[lg] : lang.views.watcher.call_send_d27[lg]"
        class="mx-1 mb-1"
        @click="$refs['file-input'].click()"
      />

      <CustomButton
        v-if="d27_file && edit_mode"
        :icon="'mdi-delete'"
        :color="'red'"
        :dark="true"
        :small="true"
        :tooltip="lang.views.watcher.call_delete_existing_d27[lg]"
        class="mr-3 mb-1"
        @click="open_delete_dialog('file')"
      />

      <!-- D27 link -->

      <CustomButton
        v-if="d27_link.id && !edit_mode"
        :text="'D27'"
        :icon="d27_link.url && d27_link.url.includes('drive') ? 'mdi-google-drive' : 'mdi-file-pdf'"
        :color="'black'"
        :dark="true"
        :tooltip="lang.views.watcher.call_download_d27[lg]"
        class="mx-1 mb-1"
        @click="open_url"
      />

      <CustomButton
        v-if="edit_mode"
        :text="'D27'"
        :icon="d27_link.id ? 'mdi-refresh' : 'mdi-link'"
        :color="d27_link.id ? 'teal' : 'blue'"
        :dark="true"
        :tooltip="d27_link.id ? lang.views.watcher.call_replace_link_d27[lg] : lang.views.watcher.call_add_link_d27[lg]"
        class="mx-1 mb-1"
        @click="add_link_dialog = true"
      />

      <CustomButton
        v-if="d27_link.id && edit_mode"
        :icon="'mdi-delete'"
        :color="'red'"
        :dark="true"
        :small="true"
        :tooltip="lang.views.watcher.call_delete_link_d27[lg]"
        class="mx-1 mb-1"
        @click="open_delete_dialog('link')"
      />
    </div>

    <div v-else>
      <Loader
        v-if="add_child_loading"
        :size="20"
        :width="5"
        class="mx-3 my-3"
      />
    </div>


    <!-- Edit commands -->

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

  <!-- Delete call dialog -->

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


  <!-- Add/replace D27 link dialog -->

  <CustomDialog
    :open="add_link_dialog"
    :width="500"
    :title_text="d27_link.id ? lang.views.watcher.call_replace_link_d27[lg] : lang.views.watcher.call_add_link_d27[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="d27_link.id ? 'mdi-refresh' : 'mdi-link-plus'"
    :confirm_text="d27_link.id ? lang.generic.replace[lg] : lang.generic.add[lg]"
    :confirm_color="d27_link.id ? 'teal' : 'blue'"
    @cancel="add_link_dialog = false"
    @confirm="add_link"
  >
    <v-text-field
      v-model="d27_new_link_url"
      outlined
      clearable
      autofocus
      :label="lang.views.watcher.call_link_url[lg]"
      hide-details
      class="mt-6"
    ></v-text-field>
  </CustomDialog>

  <input type="file"
    class="d-none"
    ref="file-input"
    v-on:change="add_file($event)"
  />
</div>

</template>


<script>

export default {
  name: 'Call',

  components: {

  },

  props: {
    self: Object,
    parent: Object,
  },

  data() {
    return {
      grab_cursor: 'grab',
      delete_dialog: false,
      delete_mode: null,
      add_link_dialog: false,
      is_updating: false,
      update_timer: null,
      d27_new_link_url: '',
      add_child_loading: false,
    }
  },

  created() {

  },

  mounted() {
    
  },

  beforeDestroy() {

  },

  computed: {
    edit_mode() {
      return this.$current_component.detail_edit_mode
    },

/*
Calculate time delta between start and end of the call in decimal
*/
    hour_calc_decimal() {
      let [start_hour, start_minute] = this.get_splitted_hour(this.self.start)
      let [end_hour, end_minute] = this.get_splitted_hour(this.self.end)

      if (start_hour != null && start_minute != null && end_hour != null && end_minute != null) {
        let start_date = new Date()
        start_date.setHours(start_hour, start_minute, 0, 0)

        let end_date = new Date()
        end_date.setHours(end_hour, end_minute, 0, 0)

        let result = (end_date - start_date) / 1000 / 60 / 60

        if (result < 0) result = 24 + result

        result = Math.round(result * 100) / 100

        if (isNaN(result)) return '?'

        return '+' + result
      }

      return '?'
    },

    hour_calc_default() {
      let decimal = parseFloat(this.hour_calc_decimal.substring(1))

      if (isNaN(decimal)) return '?'

      let hour = Math.floor(decimal)
      let minute = Math.round(((decimal - hour) * 100) / 100 * 60)

      if (minute == 0) minute = ''

      return hour + 'h' + minute
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
          'icon': delete_icon,
          'name': this.lang.generic.delete[this.lg],
          'color': 'red',
          'action': 'delete',
        },
      ]
    },

    d27_file() {
      return this.self.children.find(c => c.kind == 'd27')
    },

    d27_link() {
      let link = this.self.children.find(c => c.type == 'link')

      return link ? link : {}
    },
  },

  methods: {
    update() {
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
          'element_type': 'call',
          'element_id': this.self.id,
          'name': this.self.name,
          'kind': this.self.kind,
          'start': this.self.start,
          'end': this.self.end,
          'description': this.self.description,
        })
      }, 1000)
    },

    get_splitted_hour(time) {
      if (time) {
        let hour, minute

        if (time.includes(':')) {
          [hour, minute] = time.split(':')
        }

        else if (time.toLowerCase().includes('h')) {
          [hour, minute] = time.toLowerCase().split('h')
        }

        return [parseInt(hour), parseInt(minute)]
      }

      return [null, null]
    },

    menu_action(event) {
      if (event == 'copy') {
        console.log('copy')
      }

      else if (event == 'move') {
        console.log('move')
      }

      else if (event == 'delete') {
        this.open_delete_dialog('call')
      }
    },

    open_delete_dialog(mode) {
      this.delete_mode = mode
      this.delete_dialog = true
    },

    async remove() {
      if (this.delete_mode == 'link') {
        await this.$http.post('element', {
          'action': 'delete',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'source_type': this.parent.type,
          'source_id': this.parent.id,
          'parent_type': this.self.type,
          'parent_id': this.self.id,
          'element_type': 'link',
          'element_id': this.d27_link.id,
        })

        this.self.children = this.self.children.filter(c => c.type !== 'link')
      }

      else if (this.delete_mode == 'file') {
        await this.$http.post('element', {
          'action': 'delete',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'source_type': this.parent.type,
          'source_id': this.parent.id,
          'parent_type': this.self.type,
          'parent_id': this.self.id,
          'element_type': 'file',
          'element_id': this.d27_file.id,
        })

        this.self.children = this.self.children.filter(c => c.kind !== 'd27')
      }

      else if (this.delete_mode == 'call') {
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
          'element_type': 'call',
          'element_id': this.self.id,
        })
      }

      this.delete_dialog = false
    },

    open_url() {
      let url = this.d27_link.url

      if (url) {
        url = url.match(/^http[s]?:\/\//) ? url : 'http://' + url

        window.open(url)
      }
    },

    get_file() {
      window.open(`${this.$http.media}${this.d27_file.uid}/${this.d27_file.name}${this.d27_file.extension ? '.' + this.d27_file.extension : ''}`)
    },

    async add_file(e) {
      this.add_child_loading = true

      if (this.d27_file) {
        await this.$http.post('element', {
          'action': 'delete',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'source_type': this.parent.type,
          'source_id': this.parent.id,
          'parent_type': this.self.type,
          'parent_id': this.self.id,
          'element_type': 'file',
          'element_id': this.d27_file.id,
        })

        this.self.children = this.self.children.filter(
          c => c.id != this.d27_file.id)
      }

      this.$tool.get_file_data(e, async (data) => {
        data.append('action', 'create')
        data.append('element_type', 'file')
        data.append('kind', 'd27')
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

    async add_link() {
      this.add_link_dialog = false
      this.add_child_loading = true

      let link = this.self.children.find(c => c.type == 'link')

      if (link) {
        link.url = this.d27_new_link_url

        await this.$http.post('element', {
          'action': 'update',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'source_type': this.parent.type,
          'source_id': this.parent.id,
          'parent_type': this.self.type,
          'parent_id': this.self.id,
          'element_type': 'link',
          'element_id': this.d27_link.id,
          'url': this.d27_new_link_url,
        })
      }

      else {
        let request = await this.$http.post('element', {
          'action': 'create',
          'element_type': 'link',
          'view': this.$current_view,
          'source_type': this.parent.type,
          'source_id': this.parent.id,
          'parent_type': this.self.type,
          'parent_id': this.self.id,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'name': '',
          'url': this.d27_new_link_url,
        })

        let child = request['link']
        child.children = Array()

        this.self.children.push(child)
      }

      this.d27_new_link_url = ''
      this.add_child_loading = false
    },
  },

  watch: {

  },
}

</script>


<style>

.call-description.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)>.v-input__control>.v-input__slot {
  box-shadow: inset 0 0 0 1px orange !important;
}

.call-description.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)>.v-input__control>.v-input__slot:focus-within {
  box-shadow: inset 0 0 0 2px black !important;
}

.call-input {
  box-shadow: inset 0 0 0 1px orange !important;
  background-color: white !important;
}

.call-input:disabled {
  color: black !important;
  box-shadow: none !important;
}

</style>


<style scoped>

.call-frame {
  border-radius: 5px;
  border: 1px grey solid;
}

.call-name {
  width: 100%;
  font-size: 15px;
  font-weight: bold;
  padding: 5px 5px;
}

.call-name:disabled {
  background-color: transparent !important;
}

.call-kind {
  width: 130px;
  font-size: 13px;
  font-weight: bold;
  padding: 5px 5px;
  text-align: right;
  padding-right: 10px;
}

.call-kind:disabled {
  background-color: transparent !important;
}

.call-hour {
  border: 1px rgba(180, 180, 180, 0.5) solid;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  margin: 3px;
  width: 30%;
  font-weight: bold;
}

.call-hour:disabled {
  background-color: rgba(180, 180, 150, 0.1) !important;
}

.call-calc {
  border: 1px rgba(0, 200, 0, 0.3) solid;
  background-color: rgba(0, 200, 0, 0.1);
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  margin: 3px;
  width: 20%;
  color: rgba(0, 100, 0, 1);
}

.call-commands {
  display: flex;
  justify-content: space-between;
}

</style>
