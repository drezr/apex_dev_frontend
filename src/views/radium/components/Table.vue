<template>

<v-card class="ma-3">
  <v-toolbar :color="parent.color + ' darken-4'" dark flat dense>
    <v-toolbar-title class="d-flex">
      <v-icon class="mr-3" large>
        mdi-account-group
      </v-icon>
      <div class="mt-1">
        {{ lang.views.radium.participating_teams[lg] }}
      </div>
    </v-toolbar-title>
  </v-toolbar>

  <v-tabs
    v-if="parent.shifts.length > 0"
    v-model="selected_shift"
    :background-color="parent.color + ' darken-3'"
    dark
  >
    <v-tab v-for="(shift, i) in parent.shifts" :key="i">
      <span v-if="shift.date">{{ $tool.format_date(shift.date) }}</span>
      <span v-if="shift.date && shift.shift" class="mx-2">en</span>
      <span v-if="shift.shift">{{ shift.shift }}</span>
    </v-tab>
  </v-tabs>

  <Loader :size="100" :width="10" class="pa-16" :left="true" v-if="loading" />

  <v-tabs-items
    v-else
    v-model="selected_shift"
    class="lighten-2"
    :class="parent.color"
  >
    <v-tab-item v-for="(shift, i) in shifts" :key="i" class="mx-3 mt-3">
      <Part
        v-for="(part, i) in shift.parts"
        :key="i"
        :self="part"
        :parent="shift"
        :parent_cpnt="$current_instance"
      />

      <div v-if="shift.parts.length == 0" class="my-9 mx-6 white--text">
        {{ lang.views.radium.no_participating_teams[lg] }}
      </div>
    </v-tab-item>

    <v-tab-item v-if="parent.shifts.length == 0" class="my-9 mx-6 white--text">
      {{ lang.views.radium.no_shift[lg] }}
    </v-tab-item>
  </v-tabs-items>
</v-card>

</template>


<script>

import Part from '@/views/radium/components/Part.vue'

export default {
  name: 'WorkTable',

  components: {
    Part,
  },

  props: {
    parent: Object,
    parent_cpnt: Object,
  },

  data() {
    return {
      self: null,
      loading: true,
      selected_shift: 0,
      shifts: null,
    }
  },

  async created() {
    this.request = await this.$http.get('shifts', {
      'work_id': this.parent.id,
    })

    this.shifts = this.request.shifts
    this.loading = false
  },

  computed: {

  },

  methods: {

  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

</style>
