<template>

<div class="d-flex align-center">
  <div
    class="subtask-frame lighten-3"
    :class="[
      self.status == 'pending' ? 'orange' : 'green',
      $is_user ? 'cursor-pointer' : 'cursor-default',
    ]"
    @click="swap_status"
  >
    <v-icon
      class="ml-1 mr-3"
      :color="self.status == 'pending' ? 'orange darken-4' : 'green darken-4'"
    >
      {{ self.status == 'pending' ? 'mdi-timer-sand' : 'mdi-check' }}
    </v-icon>

    <v-textarea
      v-model="self.name"
      class="custom-field py-1 mr-2"
      :rows="1"
      auto-grow
      hide-details
      solo
      :disabled="!(edit_mode && $is_editor)"
      :flat="!(edit_mode && $is_editor)"
      :background-color="edit_mode && $is_editor ? 'white' : 'transparent'"
      @input="update"
      :placeholder="lang.generic.empty_subtask[lg]"
      @click.native.stop
    ></v-textarea>
  </div>

  <div v-if="edit_mode && $is_editor" class="mx-2 d-flex align-center">
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
  name: '',

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
          'element_type': 'subtask',
          'element_id': this.self.id,
          'name': this.$is_user && !this.$is_editor ? null : this.self.name,
          'status': this.self.status,
        })
      }, 1000)
    },

    swap_status() {
      if (this.$is_user) {
        let status = {'pending': 'done', 'done': 'pending'}

        this.self.status = status[this.self.status]

        if (!this.self.status) {
          this.self.status = 'pending'
        }

        this.update()
      }
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
        'element_type': 'subtask',
        'element_id': this.self.id,
      })
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.subtask-frame {
  display: flex;
  align-items: center;
  border-radius: 30px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  transition: background-color 0.3s;
}

.subtask-frame:hover {
  filter: contrast(1.1);
}

</style>
