<template>

<v-card class="mx-3">
  <v-toolbar
    :color="parent.color + ' darken-4'"
    :dark="parent.color != 'white'"
    flat
    dense
  >
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
    :dark="parent.color != 'white'"
  >
    <v-tab v-for="(shift, i) in parent.shifts" :key="i">
      <span v-if="shift.date">{{ $tool.format_date(shift.date) }}</span>
      <span v-if="shift.date && shift.shift" class="mx-2">en</span>
      <span v-if="shift.shift">{{ shift.shift }}</span>

      <span v-if="!shift.date && !shift.shift">-</span>
    </v-tab>
  </v-tabs>

  <v-tabs-items
    v-model="selected_shift"
    class="lighten-2"
    :class="parent.color"
    touchless
  >
    <v-tab-item
      v-for="(shift, i) in parent.shifts"
      :key="i"
      class="mx-3 mt-3"
    >
      <div class="part-loader-box" v-if="loading && (!shift.parts || shift.parts.length == 0)">
        <Loader :size="100" :width="10" />
      </div>

      <div class="d-flex">
        <Part
          v-for="(part, i) in shift.parts"
          :key="i"
          :self="part"
          :parent="shift"
          :parent_cpnt="$current_instance"
        />

        <v-card
          min-width="350"
          max-width="350"
          class="mr-3 mb-3 elevation-3 d-flex align-center justify-center"
          style="height: 200px;"
          v-if="add_part_loading"
        >
          <Loader :size="100" :width="10" />
        </v-card>
      </div>

      <div
        v-if="!loading && !add_part_loading && shift.parts.length == 0"
        class="my-9 mx-6 white--text"
      >
        {{ lang.views.radium.no_participating_teams[lg] }}
      </div>

      <div
        v-if="!shift.date"
        class="my-9 mx-6 white--text"
      >
        {{ lang.views.radium.no_shift_date[lg] }}
      </div>
    </v-tab-item>

    <div v-if="parent.shifts.length == 0" class="my-9 mx-6 white--text">
      {{ lang.views.radium.no_shift[lg] }}
    </div>

    <CustomButton
      v-if="parent.shifts.length > 0 && $is_editor"
      :text="lang.generic.teams[lg]"
      :rounded="true"
      :color="'yellow darken-3'"
      :dark="true"
      :icon="'mdi-account-multiple-plus'"
      :tooltip="lang.views.radium.link_teams_tooltip[lg]"
      :disabled="!parent.shifts[selected_shift].date || add_part_loading"
      :loading="add_part_loading"
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
    :confirm_disabled="link_selected_teams.length == 0"
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
        :value="$current_component.circles.length == 1 ? 0 : null"
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
                  :label="team.name + (app.name ? ' (' + app.name + ')' : '')"
                  hide-details
                  @change="toggle_team(team.id)"
                  :input-value="parent.shifts.length > 0 && parent.shifts[selected_shift].parts.find(p => p.team.id == team.id)"
                  :disabled="parent.shifts.length > 0 && parent.shifts[selected_shift].parts.find(p => p.team.id == team.id) ? true : false"
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
  name: 'ShiftDetail',

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
      link_teams_dialog: false,
      link_selected_teams: Array(),
      add_part_loading: false,
    }
  },

  async created() {
    this.request = await this.$http.get('shifts', {
      'work_id': this.parent.id,
    })

    for (let shift of this.request.shifts) {
      let parent_shift = this.parent.shifts.find(s => s.id == shift.id)

      if (parent_shift) {
        parent_shift.parts = shift.parts
      }
    }

    this.loading = false
  },

  computed: {
    shifts() {
      return this.parent.shifts
    }
  },

  methods: {
    async link_teams() {
      this.link_teams_dialog = false
      this.add_part_loading = true

      let selected_shift = this.parent.shifts[this.selected_shift]

      let request = await this.$http.post('works', {
        'action': 'create_parts',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_type': 'work',
        'parent_id': this.parent.id,
        'element_type': 'shift',
        'element_id': selected_shift.id,
        'value': this.link_selected_teams,
      })

      for (let part of request.parts) {
        selected_shift.parts.push(part)
      }

      this.link_selected_teams = Array()
      this.add_part_loading = false
    },

    toggle_team(team_id) {
      if (this.link_selected_teams.includes(team_id)) {
        this.link_selected_teams = this.link_selected_teams.filter(
          id => id !== team_id)
      }

      else {
        this.link_selected_teams.push(team_id)
      }
    },
  },

  watch: {
    shifts() {
      if (this.shifts.length == 1) {
        this.selected_shift = 0
      }
    },
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

.part-loader-box {
  height: 140px;
  width: 140px;
  padding: 20px;
  margin: 20px;
  border-radius: 100px;
  background-color: rgba(255, 255, 255, 0.6);
}

</style>
