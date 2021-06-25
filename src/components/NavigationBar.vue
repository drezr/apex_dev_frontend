<template>

<div class="navigation-bar-frame">
  <TimeTravel class="mr-2" />

  <div class="d-flex flex-wrap" v-if="$current_view == 'calendar'">
    <CustomButton
      :icon="'mdi-hammer-screwdriver'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      @click="go_calls"
      :tooltip="lang.views.watcher.calls_summary[lg]"
    />

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
      :icon="'mdi-printer'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      @click="go_printable_calendar"
      :tooltip="lang.views.watcher.printable_calendar[lg]"
    />

    <CustomButton
      :icon="'mdi-calendar-account'"
      :height="40"
      :outlined="true"
      class="mr-1 mb-1"
      @click="go_leaves"
      :tooltip="lang.views.watcher.leaves_management[lg]"
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
      palette_dialog: false,
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

      return ''
    }
  },

  methods: {
    go_calls() {

    },

    go_printable_calendar() {

    },

    go_leaves() {

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
  margin-bottom: 8px;
  justify-content: center;
}

</style>
