<template>

<div class="d-flex align-center mb-3">
  <v-icon class="cursor-move handle mr-3 pink--text">
    mdi-drag-horizontal-variant
  </v-icon>

  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <div
        class="leave-color-circle"
        :class="leave_type.color"
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
        @click="set_leave_color(leave_type, color)"
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
    @input="send_update(leave_type), leave_type.code = leave_type.code.toUpperCase()"
  />

  <v-text-field
    v-model="leave_type.desc"
    :label="lang.views.watcher.leaves_leave_desc[lg]"
    type="text"
    class="mx-3"
    outlined
    hide-details
    style="min-width: 290px; max-width: 290px; width: 310px;"
    @input="send_update(leave_type)"
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
    @change="update(leave_type)"
  ></v-select>

  <v-checkbox
    v-model="leave_type.visible"
    :label="lang.generic.visible[lg]"
    class="mx-3"
    hide-details
    style="position: relative; top: -10px;"
    :disabled="['presence', 'recovery', 'ignore'].includes(leave_type.kind) || leave_type.kind.includes('counter')"
    @change="send_update(leave_type)"
  ></v-checkbox>

  <CustomButton
    class="ml-3"
    :icon="'mdi-delete'"
    :small_fab="true"
    :color="'red'"
    :tooltip="lang.generic.delete[lg]"
    @click="delete_leave_type_dialog = true"
  />

  <CustomDialog
    :open="delete_leave_type_dialog"
    :width="500"
    :title_text="lang.generic.are_you_sure[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-delete'"
    :confirm_text="lang.generic.delete[lg]"
    :confirm_color="'red'"
    @cancel="delete_leave_type_dialog = false"
    @confirm="remove()"
  >
    <v-alert
      outlined
      type="warning"
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
      delete_leave_type_dialog: false,
    }
  },

  created() {

  },

  computed: {

  },

  methods: {
    set_leave_color(leave_type, color) {
      leave_type.color = color

      this.send_update()
    },

    update(leave_type) {
      if (leave_type.kind && (['presence', 'recovery', 'ignore'].includes(leave_type.kind) || leave_type.kind.includes('counter'))) {
        leave_type.visible = false
      }

      this.send_update()
    },

    async send_update() {
      if (!this.is_updating) {
        clearInterval(this.update_timer)
      }

      this.update_timer = setTimeout(async () => {
        await this.$http.post('leaves', {
          'action': 'update_config',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'value': this.leave_type,
        })
      }, 1000)
    },

    async remove() {
      let leave_types = this.$current_component.config.leave_types
      this.$current_component.config.leave_types = leave_types.filter(
        l => l != this.leave_type)

      this.delete_leave_type_dialog = false

      await this.$http.post('leaves', {
        'action': 'delete_leave_type',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'value': this.leave_type,
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

</style>
