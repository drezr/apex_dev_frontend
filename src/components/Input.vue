<template>

<div class="input-frame">
  <div class="d-flex align-center">
    <v-checkbox
      v-if="edit_mode && ['short', 'date'].includes(self.kind)"
      class="input-heading"
      v-model="self.heading"
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
        :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
        :flat="!(edit_mode && $has_xs(['watcher_is_editor']))"
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
            :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
            :flat="!(edit_mode && $has_xs(['watcher_is_editor']))"
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
        :dark="self.value == '' ? false : true"
        :badge="self.value == '' ? false : true"
        :badge_icon="'mdi-open-in-new'"
        :badge_color="'grey'"
        :badge_offset_x="16"
        :badge_offset_y="16"
        @click="go_link"
        :disabled="self.value == ''"
      />
    </div>

    <div class="d-flex align-center">
      <v-textarea
        v-if="
          self.kind == 'long' ||
          (self.kind == 'gps' && edit_mode) ||
          (self.kind == 'link' && edit_mode)
        "
        v-model="self.value"
        class="custom-field mt-1"
        :rows="1"
        auto-grow
        hide-details
        solo
        :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
        :flat="!(edit_mode && $has_xs(['watcher_is_editor']))"
        :background-color="edit_mode ? 'white' : 'transparent'"
        @input="update"
        :placeholder="lang.generic.input_value[lg]"
        :style="!edit_mode ? 'position: relative; top: -10px;' : ''"
      ></v-textarea>
    </div>
  </div>

  <div class="d-flex align-center ml-1 mr-2" v-if="edit_mode">
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
  },

  data() {
    return {
      grab_cursor: 'grab',
      delete_dialog: false,
      date_dialog: false,
    }
  },

  created() {

  },

  computed: {
    edit_mode() {
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
  },

  methods: {
    update() {

    },

    remove() {
      this.parent.children = this.parent.children.filter(
        c => c.id !== this.self.id || c.type !== this.self.type)
    },

    pick_date() {
      this.date_dialog = false
      this.$refs.dialog.save(this.self.value)

      console.log('Date updated')
    },

    go_link() {
      let url = this.self.value

      if (this.self.kind == 'gps') {
        let coord = this.self.value.replace(' ', '')
        url = `https://www.google.com/maps/place/${coord}`
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
