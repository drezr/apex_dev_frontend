<template>

<div class="input-frame">
  <div class="d-flex align-center">
    <v-checkbox
      v-if="edit_mode && $is_editor && ['short', 'date'].includes(self.kind)"
      class="input-heading"
      v-model="self.heading"
      @change="update"
      hide-details
    ></v-checkbox>
  </div>

  <div style="width: 100%;">
    <div class="d-flex flex-grow-1 align-center">
      <v-textarea
        v-model="self.key"
        class="custom-field input-key cursor-text"
        :class="self.kind == 'title' ? 'text-h5 my-2 ml-3' : ''"
        :rows="1"
        auto-grow
        hide-details
        solo
        :disabled="!(edit_mode && $is_editor)"
        :flat="!(edit_mode && $is_editor)"
        :background-color="edit_mode ? 'white' : 'transparent'"
        @input="update"
        :placeholder="lang.generic['input_' + self.kind][lg]"
      ></v-textarea>

      <v-textarea
        v-if="['short'].includes(self.kind)"
        v-model="self.value"
        class="custom-field input-value"
        :rows="1"
        auto-grow
        hide-details
        solo
        :disabled="!(edit_mode && $is_editor)"
        :flat="!(edit_mode && $is_editor)"
        :background-color="edit_mode ? 'white' : 'transparent'"
        @input="update"
        :placeholder="lang.generic.input_value[lg]"
      ></v-textarea>

      <v-dialog
        v-if="['date'].includes(self.kind)"
        ref="dialog"
        v-model="date_dialog"
        :return-value.sync="self.value"
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="$tool.format_date(self.value)"
            class="custom-field input-value"
            hide-details
            solo
            :disabled="!(edit_mode && $is_editor)"
            :flat="!(edit_mode && $is_editor)"
            :background-color="edit_mode ? 'white' : 'transparent'"
            :placeholder="lang.generic.input_value[lg]"
            v-bind="attrs"
            v-on="on"
            readonly
            style="max-width: 140px;"
            clearable
            @input="pick_date"
          ></v-text-field>
        </template>

        <v-date-picker
          v-model="self.value"
          :first-day-of-week="1"
          locale="fr-fr"
          scrollable
          no-title
          @input="pick_date"
          class="pt-12"
        ></v-date-picker>
      </v-dialog>

      <CustomButton
        v-if="['gps', 'link'].includes(self.kind)"
        class="mx-2"
        :icon="go_icon"
        :text="go_text"
        :color="go_color"
        :dark="!self.value ? false : true"
        :badge="!self.value ? false : true"
        :badge_icon="'mdi-open-in-new'"
        :badge_color="'grey'"
        :badge_offset_x="16"
        :badge_offset_y="16"
        @click="go_link"
        :disabled="!self.value"
        :tooltip="self.value ? self.value : ''"
      />
    </div>

    <div class="d-flex align-center">
      <v-textarea
        v-if="
          self.kind == 'long' ||
          (self.kind == 'gps' && edit_mode && $is_editor) ||
          (self.kind == 'link' && edit_mode && $is_editor)
        "
        v-model="self.value"
        class="custom-field mt-1"
        :rows="1"
        auto-grow
        hide-details
        solo
        :disabled="!(edit_mode && $is_editor)"
        :flat="!(edit_mode && $is_editor)"
        :background-color="edit_mode ? 'white' : 'transparent'"
        @input="update"
        :placeholder="value_placeholder"
        :style="!edit_mode ? 'position: relative; top: -10px;' : ''"
      ></v-textarea>
    </div>
  </div>

  <div class="d-flex align-center ml-1 mr-2" v-if="edit_mode && $is_editor">
    <CustomButton
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
      v-if="$is_in_task"
      :icon="'mdi-delete'"
      :small_fab="true"
      :text_color="'red'"
      :tooltip="lang.generic.delete[lg]"
      @click="delete_dialog = true"
    />
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
</div>

</template>


<script>

export default {
  name: 'Input',

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
      date_dialog: false,
      is_updating: false,
      update_timer: null,
    }
  },

  created() {

  },

  computed: {
    edit_mode() {
      if (this.is_template) {
        return true
      }
      
      return this.$current_component.detail_edit_mode
    },

    go_icon() {
      if (this.self.kind == 'gps') return 'mdi-map-search'
      else if (this.self.kind == 'link') return 'mdi-link'
      
      return null
    },

    go_color() {
      if (this.self.kind == 'gps') return 'blue'
      else if (this.self.kind == 'link') return 'purple lighten-1'
      
      return null
    },

    go_text() {
      if (this.self.kind == 'gps') return 'Maps'
      else if (this.self.kind == 'link') return this.lang.generic.visit[this.lg]
      
      return null
    },

    value_placeholder() {
      if (this.self.kind == 'gps') {
        return this.lang.generic.coordinates[this.lg]
      }

      else if (this.self.kind == 'link') {
        return this.lang.generic.url[this.lg]
      }

      else {
        return this.lang.generic.input_value[this.lg]
      }
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
          'source_type': this.$child_task_component.parent.type,
          'source_id': this.$child_task_component.parent.id,
          'parent_type': this.parent.type,
          'parent_id': this.parent.id,
          'element_type': 'input',
          'element_id': this.self.id,
          'key': this.self.key,
          'value': this.self.value,
          'heading': this.self.heading,
        })
      }, 1000)
    },

    async remove() {
      this.delete_dialog = false
      
      this.parent.children = this.parent.children.filter(
        c => c.id !== this.self.id || c.type !== this.self.type)

      await this.$http.post('element', {
        'action': 'delete',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'source_type': this.$child_task_component.parent.type,
        'source_id': this.$child_task_component.parent.id,
        'parent_type': this.parent.type,
        'parent_id': this.parent.id,
        'element_type': 'input',
        'element_id': this.self.id,
      })
    },

    pick_date() {
      this.date_dialog = false
      this.$refs.dialog.save(this.self.value)
      this.update()
    },

    go_link() {
      let url = this.self.value

      if (this.self.kind == 'gps') {
        let coord = this.self.value.replace(' ', '')
        url = `https://www.google.com/maps/place/${coord}`
      }

      else if (this.self.kind == 'link') {
        url = url.match(/^http[s]?:\/\//) ? url : 'http://' + url
      }

      window.open(url)
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.input-frame {
  display: flex;
  border-bottom: 1px grey solid;
  color: black;
  background-color: white;
}

.input-key {
  width: 40%;
  font-weight: bold;
}

.input-value {
  width: 60%;
  margin-left: 6px !important;
}

.input-heading {
  position: relative;
  top: -10px;
  left: 3px;
}

</style>
