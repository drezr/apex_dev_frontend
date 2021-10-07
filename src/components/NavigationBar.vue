<template>

<div class="navigation-bar-frame">
  <TimeTravel class="mr-2" />

  <div class="d-flex flex-wrap" v-if="$current_view == 'calendar'">
    <CustomButton
      :icon="'mdi-palette'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      @click="palette_dialog = true"
      :tooltip="palette_tooltip"
    />

    <CustomButton
      :icon="'mdi-calculator'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      @click="calculator_dialog = true"
      :tooltip="lang.views.watcher.hour_calculator[lg]"
    />

    <CustomButton
      :icon="'mdi-calendar-account'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      @click="go_leaves"
      :tooltip="lang.views.watcher.leaves_management[lg]"
    />

    <CustomButton
      :icon="'mdi-printer'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      @click="go_printable_calendar"
      :tooltip="lang.views.watcher.printable_calendar[lg]"
      :badge="true"
      :badge_icon="'mdi-open-in-new'"
      :badge_color="'grey'"
      :badge_offset_x="18"
      :badge_offset_y="18"
    />

    <CustomButton
      :icon="'mdi-hammer-screwdriver'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      @click="go_calls"
      :tooltip="lang.views.watcher.calls_summary[lg]"
      :badge="true"
      :badge_icon="'mdi-open-in-new'"
      :badge_color="'grey'"
      :badge_offset_x="18"
      :badge_offset_y="18"
    />
  </div>

  <div class="d-flex flex-wrap" v-if="$current_view == 'works'">
    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-palette'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      :tooltip="palette_tooltip"
      @click="$emit('toggle-palette')"
      :color="$current_component.palette ? 'black' : ''"
    />

    <CustomButton
      :icon="'mdi-filter'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      :tooltip="lang.views.radium.filter_works_tooltip[lg]"
      @click="$emit('open-filter-dialog')"
    />

<!--     <CustomButton
      :icon="'mdi-sort'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      :tooltip="lang.views.radium.sort_works_tooltip[lg]"
    /> -->

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-tune-vertical'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      :tooltip="lang.views.radium.customize_tooltip[lg]"
      @click="$emit('open-customize-dialog')"
    />

    <CustomButton
      :icon="'mdi-printer'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      :tooltip="lang.views.radium.printable_tooltip[lg]"
      @click="go_printable_works"
      :badge="true"
      :badge_icon="'mdi-open-in-new'"
      :badge_color="'grey'"
      :badge_offset_x="18"
      :badge_offset_y="18"
    />

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-plus'"
      :height="40"
      :color="'green'"
      :dark="true"
      class="mr-1 mb-1"
      :tooltip="lang.views.radium.add_work_tooltip[lg]"
    />

    <CustomButton
      v-if="$is_editor"
      :icon="'mdi-android-messages'"
      :height="40"
      :color="'deep-orange'"
      :dark="true"
      class="mr-1 mb-1"
      :tooltip="lang.views.radium.show_messages_tooltip[lg]"
      :badge="!$current_component.messages_loading"
      :badge_content="String($current_component.messages.length)"
      :badge_color="$current_component.messages.length == 0 ? 'blue' : 'red'"
      @click="$emit('open-messages-dialog')"
    />
  </div>

  <div class="d-flex flex-wrap" v-if="$current_view == 'board'">
    <CustomButton
      :icon="'mdi-printer'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
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
    }
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
