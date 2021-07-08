<template>

<div class="input-frame">
  <div class="d-flex align-center">
    <v-checkbox
      v-if="edit_mode"
      class="input-heading"
      v-model="self.heading"
      hide-details
    ></v-checkbox>
  </div>

  <v-textarea
    v-model="self.key"
    class="custom-field input-key"
    :rows="1"
    auto-grow
    hide-details
    solo
    :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
    :flat="!(edit_mode && $has_xs(['watcher_is_editor']))"
    :background-color="edit_mode ? 'white' : 'transparent'"
    @input="update"
    :placeholder="lang.generic.empty_task[lg]"
  ></v-textarea>

  <v-textarea
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
    :placeholder="lang.generic.empty_task[lg]"
  ></v-textarea>

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
    }
  },

  created() {

  },

  computed: {
    edit_mode() {
      return this.$current_component.detail_edit_mode
    },
  },

  methods: {
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
