<template>

<div>
  <div class="code-frame">
    <div class="d-flex pa-2">
      <v-text-field
        v-model="self.presence"
        :label="lang.generic.code_presence[lg]"
        persistent-placeholder
        hide-details
        outlined
        dense
        style="width: 190px;"
        @input="update()"
      />

      <v-text-field
        v-model="self.work"
        :label="lang.generic.code_work[lg]"
        persistent-placeholder
        hide-details
        outlined
        class="ml-3"
        dense
        style="width: 110px;"
        @input="update()"
      />

      <v-text-field
        v-model="self.place"
        :label="lang.generic.code_place[lg]"
        persistent-placeholder
        hide-details
        outlined
        class="ml-3"
        dense
        style="width: 160px;"
        @input="update()"
      />

      <v-text-field
        v-model="self.hour"
        :label="lang.generic.code_hour[lg]"
        persistent-placeholder
        hide-details
        outlined
        dense
        class="ml-3"
        type="number"
        style="width: 110px;"
        @input="update()"
      />

      <v-text-field
        v-model="self.start"
        :label="lang.generic.code_start[lg]"
        persistent-placeholder
        hide-details
        outlined
        class="ml-3"
        dense
        style="width: 100px;"
        @input="update(); set_end();"
      />

      <v-text-field
        v-model="self.end"
        :label="lang.generic.code_end[lg]"
        persistent-placeholder
        hide-details
        outlined
        class="ml-3"
        dense
        style="width: 100px;"
        @input="update()"
      />
    </div>

    <div class="d-flex px-2 pb-2" v-if="expanded">
      <v-text-field
        v-model="self.project"
        :label="lang.generic.code_project[lg]"
        persistent-placeholder
        hide-details
        outlined
        dense
        @input="update()"
      />
      
      <v-text-field
        v-model="self.other"
        :label="lang.generic.code_other[lg]"
        persistent-placeholder
        hide-details
        outlined
        class="ml-3"
        dense
        @input="update()"
      />
      
      <v-text-field
        v-model="self.activity"
        :label="lang.generic.code_activity[lg]"
        persistent-placeholder
        hide-details
        outlined
        class="ml-3"
        dense
        @input="update()"
      />
      
      <v-text-field
        v-model="self.network"
        :label="lang.generic.code_network[lg]"
        persistent-placeholder
        hide-details
        outlined
        class="ml-3"
        dense
        @input="update()"
      />

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
        class="ml-1"
      />

      <CustomButton
        :icon="'mdi-delete'"
        :small_fab="true"
        :text_color="'red'"
        :tooltip="lang.generic.delete[lg]"
        @click="delete_dialog = true"
      />
    </div>

    <div
      @click="expanded = !expanded"
      class="code-expand-button blue"
    >
      <v-icon small class="white--text">
        {{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
      </v-icon>
    </div>
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
      expanded: false,
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
          'element_type': 'code',
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

    set_end() {

    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.code-frame {
  border-radius: 5px;
  border: 1px grey solid;
  background-color: white;
}

.code-expand-button {
  width: 100%;
  height: 12px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-expand-button:hover {
  filter: brightness(1.1);
}

</style>
