<template>

<div></div>

</template>


<script>

export default {
  name: 'Code',

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
          'presence': this.self.presence,
          'place': this.self.place,
          'work': this.self.work,
          'project': this.self.project,
          'other': this.self.other,
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
        'element_type': 'code',
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

.note-frame {
  border-radius: 5px;
  border: 1px grey solid;
  background-color: white;
}

.note-disabled {
  opacity: 0.3;
  pointer-events: none;
  transition: opacity 0.2s;
}

.note-simple-textarea {
  flex-grow: 1;
  padding: 3px;
  font-size: 14px;
  resize: none;
  padding: 5px;
}

</style>
