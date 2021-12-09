<template>

<div class="d-flex">
  <v-icon class="cursor-move handle mr-3 pink--text">
    mdi-drag-horizontal-variant
  </v-icon>

  <div
    class="d-flex align-center justify-center pa-2 mb-1 rounded-lg"
    :class="!edit_mode ? ' grey lighten-4' : ''"
  >
    <v-menu offset-y :disabled="!edit_mode">
      <template v-slot:activator="{ on, attrs }">
        <div
          class="leave-color-circle"
          :class="[
            leave_type.color,
            !edit_mode ? 'leave-color-circle-disabled' : ''
          ]"
          v-bind="attrs"
          v-on="on"
        ></div>
      </template>

      <div
        class="d-flex flex-wrap white pa-1"
        style="width: 154px; border: 1px rgba(0, 0, 0, 0.3) solid !important;"
      >
        <div
          v-for="(color, x) in $current_component.leave_colors"
          :key="x"
          class="leave-color-circle"
          :class="[
            color,
            color == leave_type.color ? 'leave-color-circle-selected': '',
          ]"
          @click="leave_type.color = color"
        ></div>
      </div>
    </v-menu>

    <v-text-field
      v-model="leave_type.code"
      :label="lang.views.watcher.leaves_leave_name[lg]"
      type="text"
      class="mx-3"
      outlined
      hide-details
      style="min-width: 120px; max-width: 120px; width: 120px;"
      @input="leave_type.code.toUpperCase()"
      :disabled="!edit_mode"
      :error="check_code"
      :autocomplete="Math.random()"
    />

    <v-select
      v-model="leave_type.kind"
      :items="$current_component.leave_kinds"
      item-text="name"
      item-value="value"
      :label="lang.views.watcher.leaves_leave_type[lg]"
      outlined
      hide-details
      class="mx-3"
      style="min-width: 190px; max-width: 190px; width: 190px;"
      @change="set_visible(leave_type)"
      :disabled="!edit_mode"
      :error="check_kind"
    ></v-select>

    <v-text-field
      v-model="leave_type.desc"
      :label="lang.views.watcher.leaves_leave_desc[lg]"
      type="text"
      class="mx-3"
      outlined
      hide-details
      style="min-width: 290px; max-width: 290px; width: 310px;"
      :disabled="!edit_mode"
      :autocomplete="Math.random()"
    />

    <v-checkbox
      v-model="leave_type.visible"
      :label="lang.generic.visible[lg]"
      class="mx-3"
      hide-details
      style="position: relative; top: -10px;"
      :disabled="['presence', 'recovery', 'ignore'].includes(leave_type.kind) || leave_type.kind.includes('counter') || !edit_mode"
    ></v-checkbox>

    <CustomButton
      v-if="!edit_mode"
      class="ml-9"
      :icon="'mdi-pencil'"
      :fab="true"
      :color="'white'"
      :text_color="'teal'"
      :elevation="1"
      :tooltip="lang.generic.edit[lg]"
      @click="edit_mode = true"
    />

    <CustomButton
      v-if="edit_mode"
      class="ml-2"
      :icon="'mdi-content-save'"
      :small_fab="true"
      :color="'teal'"
      :tooltip="lang.generic.save[lg]"
      @click="save()"
      :disabled="check_code || check_kind"
    />

    <CustomButton
      v-if="edit_mode"
      class="ml-3"
      :icon="'mdi-delete'"
      :small_fab="true"
      :color="'red'"
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
    @confirm="remove()"
  >
    <v-alert
      outlined
      type="warning"
      v-if="leave_type.id"
    >
      {{ lang.views.watcher.leaves_remove_leave_type_warning[lg] }}
    </v-alert>
  </CustomDialog>
</div>

</template>


<script>

export default {
  name: 'LeaveType',

  components: {

  },

  props: {
    leave_type: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      edit_mode: false,
      delete_dialog: false,
    }
  },

  created() {
    if (!this.leave_type.id) {
      this.edit_mode = true
    }
  },

  computed: {
    check_code() {
      let is_empty = this.leave_type.code.length == 0
      let code_exist = this.$current_component.config.leave_types.find(
        l => l.code == this.leave_type.code && l.id != this.leave_type.id)
      code_exist = code_exist ? true : false

      return is_empty || code_exist
    },

    check_kind() {
      let is_empty = this.leave_type.kind.length == 0

      return is_empty
    },
  },

  methods: {
    set_visible() {
      if (this.leave_type.kind && (['presence', 'recovery', 'ignore'].includes(this.leave_type.kind) || this.leave_type.kind.includes('counter'))) {
        this.leave_type.visible = false
      }
    },

    save() {
      if (this.leave_type.id) {
        this.update()
      }

      else {
        this.create()
      }

      this.edit_mode = false
    },

    async create() {
      await this.$http.post('leaves', {
        'action': 'create_leave_type',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'year': this.$current_year,
        'value': this.leave_type,
      })
    },

    async update() {
      await this.$http.post('leaves', {
        'action': 'update_leave_type',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'value': this.leave_type,
      })
    },

    async remove() {
      let leave_types = this.$current_component.config.leave_types
      this.$current_component.config.leave_types = leave_types.filter(
        l => l != this.leave_type)

      this.delete_dialog = false

      if (this.leave_type.id) {
        await this.$http.post('leaves', {
          'action': 'delete_leave_type',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'value': this.leave_type,
        })
      }
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.leave-color-circle {
  width: 30px;
  min-width: 30px;
  max-width: 30px;
  height: 30px;
  border-radius: 15px;
  margin: 3px;
  cursor: pointer;
  transition: filter .2s, box-shadow .2s;
}

.leave-color-circle:hover {
  filter: brightness(1.3);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, .8);
}

.leave-color-circle-selected {
  filter: brightness(1.3);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, .8);
}

.leave-color-circle-disabled:hover {
  cursor: default !important;
  box-shadow: none !important;
  filter: brightness(1) !important;
}

</style>
