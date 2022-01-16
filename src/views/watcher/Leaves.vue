<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" style="padding-bottom: 50px;">
      <div class="team-title my-3">
        {{ team.name }}

        <CustomButton
          @click="leave_config_dialog = true"
          :tooltip="lang.views.watcher.leaves_config[lg]"
          :icon="'mdi-cog'"
          :color="'teal'"
          :text_color="'white'"
          class="ml-3"
        ></CustomButton>
      </div>

      <NavigationBar class="mb-6" />

      <div v-if="config.leave_types.length > 0" class="d-flex justify-center mt-3">
        <div>
          <Leave
            v-for="(profile, i) in team.profiles"
            :key="i"
            :profile="profile"
          ></Leave>
        </div>
      </div>

      <div v-else class="d-flex justify-center align-center my-16">
        <div class="text-center">
          {{ lang.views.watcher.leaves_no_leave_set_1[lg] }}<br>
          <small>{{ lang.views.watcher.leaves_no_leave_set_2[lg] }}</small>
        </div>
      </div>
    </div>
  </transition>

  <CustomDialog
    :open="leave_config_dialog"
    :width="1020"
    :title_text="lang.views.watcher.leaves_config[lg]"
    :title_icon="'mdi-tune-vertical'"
    @cancel="leave_config_dialog = false"
  >
    <div class="mt-6">
      <VueDraggable
        v-model="config.leave_types"
        @change="update_leave_types_position()"
        :animation="100"
        easing="cubic-bezier(1, 0, 0, 1)"
        handle=".handle"
      >
        <LeaveType
          v-for="(leave_type, i) in config.leave_types"
          :key="i + rerender_count"
          :leave_type="leave_type"
        />
      </VueDraggable>

      <div class="d-flex justify-center mt-9">
        <CustomButton
          :text="lang.views.watcher.leaves_add_leave_type[lg]"
          :icon="'mdi-plus'"
          :color="'green'"
          :dark="true"
          @click="add_leave_type"
        />

        <CustomButton
          :text="lang.views.watcher.leaves_set_leave_config[lg]"
          :icon="'mdi-cog-sync'"
          :color="'blue'"
          :dark="true"
          :badge="true"
          :badge_color="'red'"
          :badge_icon="'mdi-alert'"
          class="ml-3"
          @click="set_leave_config_dialog = true"
        />
      </div>
    </div>
  </CustomDialog>




  <CustomDialog
    :open="set_leave_config_dialog"
    :width="600"
    :title_text="lang.views.watcher.leaves_set_leave_config[lg]"
    :title_icon="'mdi-cog-sync'"
    :confirm_icon="'mdi-content-save'"
    :confirm_text="lang.generic.define[lg]"
    :confirm_color="'blue'"
    :confirm_disabled="!selected_leave_config"
    @cancel="set_leave_config_dialog = false"
    @confirm="set_leave_config_dialog_confirm = true"
  >
    <v-alert type="error" class="my-3">
      {{ lang.views.watcher.leaves_set_leave_config_alert[lg] }}
    </v-alert>

    <div class="mt-3 d-flex justify-center">
      <v-radio-group v-model="selected_leave_config">
        <v-radio
          v-for="(leave_config, i) in leave_configs"
          :key="i"
          :label="leave_config.name"
          :value="leave_config.value"
        ></v-radio>
      </v-radio-group>
    </div>
  </CustomDialog>




  <CustomDialog
    :open="set_leave_config_dialog_confirm"
    :width="450"
    :title_text="lang.generic.are_you_sure[lg]"
    :title_icon="'mdi-cog-sync'"
    :cancel_icon="add_leave_config_loading ? '' : 'mdi-close'"
    :cancel_text="add_leave_config_loading ? '' : lang.generic.cancel[lg]"
    :cancel_disabled="add_leave_config_loading"
    :confirm_icon="'mdi-check'"
    :confirm_text="lang.generic.confirm[lg]"
    :confirm_color="'blue'"
    :confirm_disabled="add_leave_config_loading"
    @cancel="set_leave_config_dialog_confirm = false"
    @confirm="add_leave_config()"
  >
    <Loader :size="50" :width="5" class="mt-6" v-if="add_leave_config_loading" />
  </CustomDialog>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import Leave from '@/views/watcher/components/Leave.vue'
import LeaveType from '@/views/watcher/components/LeaveType.vue'

export default {
  name: 'Leaves',

  components: {
    NavigationBar,
    Leave,
    LeaveType,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      quotas: Array(),
      config: Object(),
      is_updating: false,
      update_timer: null,
      delete_leave_type_dialog: false,
      selected_leave_type: null,
      leave_config_dialog: false,
      set_leave_config_dialog: false,
      set_leave_config_dialog_confirm: false,
      selected_leave_config: null,
      add_leave_config_loading: false,
      rerender_count: 0,
      leave_colors: [
        'red',
        'pink',
        'purple',
        'deep-purple',
        'indigo',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'blue-grey',
      ],
    }
  },

  async created() {
    this.request = await this.$http.get('leaves', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.quotas = this.request.quotas
    this.config = this.request.config

    this.config.leave_types.sort(
      (a, b) => a.position - b.position)

    this.team.profiles = this.team.profiles.filter(p => p.link.watcher_is_visible)
    this.team.profiles.sort((a, b) => a.link.position - b.link.position)

    for (let profile of this.team.profiles) {
      let quotas = this.quotas.filter(l => l.profile == profile.id)
      this.$set(profile, 'quotas', quotas)

      for (let quota of profile.quotas) {
        quota.value = Number(quota.value)
      }
    }

    this.loading = false
  },

  computed: {
    leave_kinds() {
      return [
        {'value': 'normal_leave', 'name': this.lang.generic.normal_leave[this.lg]},
        {'value': 'credit_day', 'name': this.lang.generic.credit_day[this.lg]},
        {'value': 'variable_leave', 'name': this.lang.generic.variable_leave[this.lg]},
        {'value': 'saturday', 'name': this.lang.generic.saturday[this.lg]},
        {'value': 'sunday', 'name': this.lang.generic.sunday[this.lg]},
        {'value': 'holiday', 'name': this.lang.generic.holiday[this.lg]},
        {'value': 'hour', 'name': this.lang.generic.hour[this.lg]},
        {'value': 'counter', 'name': this.lang.generic.counter[this.lg]},
        {'value': 'counter_sick', 'name': this.lang.generic.counter_sick[this.lg]},
        {'value': 'counter_special', 'name': this.lang.generic.counter_special[this.lg]},
        {'value': 'counter_unjustified', 'name': this.lang.generic.counter_unjustified[this.lg]},
        {'value': 'counter_strike', 'name': this.lang.generic.counter_strike[this.lg]},
        {'value': 'counter_wounded', 'name': this.lang.generic.counter_wounded[this.lg]},
        {'value': 'presence', 'name': this.lang.generic.presence[this.lg]},
        {'value': 'recovery', 'name': this.lang.generic.recovery[this.lg]},
        {'value': 'ignore', 'name': this.lang.generic.ignore[this.lg]},
      ]
    },

    leave_configs() {
      return [
        {'name': this.lang.views.watcher.leaves_leave_config_french_default[this.lg], 'value': 'french_default'},
        {'name': this.lang.views.watcher.leaves_leave_config_dutch_default[this.lg], 'value': 'dutch_default'},
        {'name': this.lang.views.watcher.leaves_leave_config_empty_config[this.lg], 'value': 'none'},
      ]
    },
  },

  methods: {
    async update_leave_types_position() {
      let i = 0

      for (let leave_type of this.config.leave_types) {
        leave_type.position = i
        i++
      }

      await this.$http.post('leaves', {
        'action': 'update_leave_types_position',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'value': this.config.leave_types,
      })
    },

    async add_leave_type() {
      this.config.leave_types.push({
        'code': '',
        'desc': '',
        'kind': '',
        'color': 'red',
        'visible': false,
        'config': this.config.id,
        'position': this.config.leave_types.length,
      })
    },

    async add_leave_config() {
      this.add_leave_config_loading = true

      let request = await this.$http.post('leaves', {
        'action': 'add_leave_config',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'value': this.selected_leave_config,
        'year': this.$current_year,
      })

      this.quotas = request.quotas
      this.config = request.config

      this.config.leave_types.sort(
        (a, b) => a.position - b.position)

      for (let profile of this.team.profiles) {
        let quotas = this.quotas.filter(l => l.profile == profile.id)
        this.$set(profile, 'quotas', quotas)

        for (let quota of profile.quotas) {
          quota.value = Number(quota.value)
        }
      }

      this.set_leave_config_dialog = false
      this.set_leave_config_dialog_confirm = false
      this.add_leave_config_loading = false
      this.selected_leave_config = null
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

</style>
