<template>

<div class="navigation-bar-frame">
  <TimeTravel />

  <div class="d-flex flex-wrap justify-center" v-if="$current_view == 'calendar'">
    <CustomButton
      :icon="'mdi-palette'"
      :height="40"
      class="ml-1 mb-1"
      @click="$emit('toggle-palette')"
      :tooltip="palette_tooltip"
      :outlined="$current_component.palette ? false : true"
      :dark="$current_component.palette ? true : false"
      :color="$current_component.palette ? 'black' : ''"
      v-if="$is_editor"
    />

    <CustomButton
      :icon="'mdi-calculator'"
      :height="40"
      class="ml-1 mb-1"
      :tooltip="lang.views.watcher.hour_calculator[lg]"
      @click="$emit('toggle-decimal-calculator')"
      :outlined="$current_component.decimal_calculator ? false : true"
      :dark="$current_component.decimal_calculator ? true : false"
      :color="$current_component.decimal_calculator ? 'black' : ''"
      v-if="$is_editor"
    />

    <CustomButton
      :icon="'mdi-calendar-account'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      @click="go_leaves"
      :tooltip="lang.views.watcher.leaves_management[lg]"
      v-if="$has_xs(['is_manager'])"
    />

    <CustomButton
      v-if="$current_component.profiles.length > 0"
      :icon="'mdi-printer'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      @click="go_printable_calendar"
      :tooltip="lang.views.watcher.printable_calendar[lg]"
      :badge="true"
      :badge_icon="'mdi-open-in-new'"
      :badge_color="'grey'"
      :badge_offset_x="18"
      :badge_offset_y="18"
    />

    <CustomButton
      v-if="$current_component.profiles.length > 0"
      :icon="'mdi-hammer-screwdriver'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      @click="go_calls"
      :tooltip="lang.views.watcher.calls_summary[lg]"
      :badge="true"
      :badge_icon="'mdi-open-in-new'"
      :badge_color="'grey'"
      :badge_offset_x="18"
      :badge_offset_y="18"
    />
  </div>

  <div class="d-flex flex-wrap justify-center" v-if="$current_view == 'quota'">
    <CustomButton
      :icon="'mdi-calendar-account'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      @click="go_leaves"
      :tooltip="lang.views.watcher.leaves_management[lg]"
      v-if="$has_xs(['is_manager'])"
    />
  </div>

  <div class="d-flex flex-wrap justify-center" v-if="$current_view == 'works'">
    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-palette'"
      :height="40"
      class="ml-1 mb-1"
      :tooltip="palette_tooltip"
      @click="$emit('toggle-palette')"
      :outlined="$current_component.palette ? false : true"
      :dark="$current_component.palette ? true : false"
      :color="$current_component.palette ? 'black' : ''"
    />

    <CustomButton
      :icon="'mdi-filter'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      :tooltip="lang.views.radium.filter_works_tooltip[lg]"
      @click="$emit('open-filter-dialog')"
    />

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-sort'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      :tooltip="lang.views.radium.sort_works_tooltip[lg]"
      @click="$emit('open-sort-dialog')"
      :disabled="$current_component.active_filters.length > 0"
    />

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-tune-vertical'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      :tooltip="lang.views.radium.customize_tooltip[lg]"
      @click="$emit('open-customize-dialog')"
    />

    <CustomButton
      :icon="'mdi-printer'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      :tooltip="lang.views.radium.printable_tooltip[lg]"
      :badge="true"
      :badge_icon="'mdi-open-in-new'"
      :badge_color="'grey'"
      :badge_offset_x="18"
      :badge_offset_y="18"
      @click="go_printable_works"
    />

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-check'"
      :height="40"
      :color="'red lighten-1'"
      class="ml-1 mb-1"
      :tooltip="lang.views.radium.clear_all_is_edited[lg]"
      @click="$emit('clear-all-is-edited')"
      :dark="true"
      :badge="true"
      :badge_bordered="true"
      :badge_dot="true"
      :badge_color="'red accent-3'"
      :badge_offset_x="12"
      :badge_offset_y="12"
    />

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-pencil-plus'"
      :height="40"
      :color="'teal'"
      class="ml-1 mb-1"
      :tooltip="lang.views.radium.edit_all_tooltip[lg]"
      @click="$emit('edit-all')"
      :outlined="$current_component.edit_all ? true : false"
      :dark="$current_component.edit_all ? false : true"
    />

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-android-messages'"
      :height="40"
      :color="'deep-orange'"
      :dark="true"
      class="ml-1 mb-1"
      :tooltip="lang.views.radium.show_messages_tooltip[lg]"
      :badge="true"
      :badge_content="String($current_component.message_count)"
      :badge_color="$current_component.message_count == 0 ? 'blue' : 'red'"
      :badge_offset_x="18"
      :badge_offset_y="18"
      @click="$emit('open-messages-dialog')"
    />

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-plus'"
      :height="40"
      :color="'green'"
      :dark="!add_loading"
      class="ml-1 mb-1"
      :tooltip="lang.views.radium.add_work_tooltip[lg]"
      :disabled="add_loading"
      :loading="add_loading"
      @click="$emit('add-work')"
    />
  </div>

  <div class="d-flex flex-wrap justify-center" v-if="$current_view == 'board'">
    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-folder-cog'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      @click="$emit('open-folders-dialog')"
      :tooltip="lang.views.planner.folders_setting[lg]"
    />

    <CustomButton
      :icon="'mdi-printer'"
      :height="40"
      :outlined="true"
      class="ml-1 mb-1"
      @click="go_printable_board"
      :tooltip="lang.views.planner.printable_board[lg]"
      :badge="true"
      :badge_icon="'mdi-open-in-new'"
      :badge_color="'grey'"
      :badge_offset_x="18"
      :badge_offset_y="18"
    />
  </div>
</div>

</template>


<script>

import TimeTravel from '@/components/TimeTravel.vue'

export default {
  name: 'NavigationBar',

  components: {
    TimeTravel,
  },

  props: {
    
  },

  data() {
    return {
      calculator_dialog: false,
    }
  },

  created() {

  },

  computed: {
    palette_tooltip() {
      if (this.$current_view == 'calendar') {
        return this.lang.views.watcher.palette_cells[this.lg]
      }

      else if (this.$current_view == 'works') {
        return this.lang.views.radium.palette_works_tooltip[this.lg]
      }

      return ''
    },

    add_loading() {
      return this.$current_component.add_loading
    },
  },

  methods: {
    go_calls() {
      window.open(`/team/${this.$current_team_id}/watcher/${this.$current_app_id}/calls/month/${this.$current_month}/year/${this.$current_year}`)
    },

    go_printable_calendar() {
      window.open(`/team/${this.$current_team_id}/watcher/${this.$current_app_id}/calendarprintable/month/${this.$current_month}/year/${this.$current_year}`)
    },

    go_printable_works() {
      window.open(`/team/${this.$current_team_id}/radium/${this.$current_app_id}/worksprintable/month/${this.$current_month}/year/${this.$current_year}`)
    },

    go_printable_board() {
      window.open(`/team/${this.$current_team_id}/planner/${this.$current_app_id}/boardprintable/month/${this.$current_month}/year/${this.$current_year}`)
    },

    go_leaves() {
      this.$router.push(`/team/${this.$current_team_id}/watcher/${this.$current_app_id}/leaves/year/${this.$current_year}`)
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.navigation-bar-frame {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
}

</style>
