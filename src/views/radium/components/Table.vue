<template>

<v-card class="mx-3 mt-3">
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

  <v-tabs-items
    v-model="selected_shift"
    class="lighten-2"
    :class="parent.color"
  >

    <Loader :size="100" :width="10" class="pa-16" :left="true" v-if="loading" />

    <v-tab-item
      v-for="(shift, i) in shifts"
      :key="i"
      class="mx-3 mt-3"
      v-else
    >
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

    <CustomButton
      :text="lang.generic.teams[lg]"
      :rounded="true"
      :color="'yellow darken-3'"
      :dark="true"
      :icon="'mdi-account-multiple-plus'"
      :tooltip="lang.views.radium.link_teams_tooltip[lg]"
      class="mx-3 mb-3"
      @click="link_teams_dialog = true"
    />
  </v-tabs-items>

  <CustomDialog
    :open="link_teams_dialog"
    :width="500"
    :title_text="lang.views.radium.link_teams_tooltip[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-account-multiple-plus'"
    :confirm_text="lang.generic.add[lg]"
    :confirm_color="'yellow darken-3'"
    @cancel="link_teams_dialog = false"
    @confirm="link_teams"
  >
    <Loader
      v-if="$current_component.circles_loading || loading"
      :size="100"
      :width="10"
      :mt="50"
      :mb="50"
    />

    <div class="mt-3" v-else>
      <v-expansion-panels
        class="work-link-expension-panel"
        v-for="(circle, x) in $current_component.circles"
        :key="x"
      >
        <v-expansion-panel>
          <v-expansion-panel-header>
            <b>{{ circle.name }}</b>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <div
              v-for="(team, y) in circle.teams"
              :key="y"
            >
              <div
                v-for="(app, z) in team.apps.filter(a => a.app == 'watcher')"
                :key="z"
              >
                <v-checkbox
                  v-if="loading == false"
                  :label="team.name + (app.name ? ' (' + app.name + ')': '')"
                  hide-details
                  @change="toggle_team(app.id)"
                  :input-value="shifts[selected_shift].parts.find(p => p.team.id == team.id)"
                  :disabled="shifts[selected_shift].parts.find(p => p.team.id == team.id) ? true : false"
                ></v-checkbox>
              </div>
            </div>

            <div style="width: 100%; height: 20px;"></div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </CustomDialog>
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
      shifts: Array(),
      link_teams_dialog: false,
      link_selected_teams: Array(),
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
    link_teams() {
      this.link_teams_dialog = false
    },

    toggle_team(app_id) {
      if (this.link_selected_teams.includes(app_id)) {
        this.link_selected_teams = this.link_selected_teams.filter(
          id => id !== app_id)
      }

      else {
        this.link_selected_teams.push(app_id)
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

.work-link-expension-panel {
  border: 1px rgba(0, 0, 0, 0.3) solid;
  margin-top: 10px;
}

</style>
