<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
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
            class="mb-1"
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
    :width="950"
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
          v-for="leave_type in config.leave_types"
          :key="leave_type.id"
          :leave_type="leave_type"
        />
      </VueDraggable>

      <div class="d-flex justify-center mt-9">
        <CustomButton
          :text="lang.views.watcher.leaves_add_leave_type[lg]"
          :icon="'mdi-plus'"
          :color="'green'"
          :dark="!add_leave_type_loading"
          :loading="add_leave_type_loading"
          :disabled="add_leave_type_loading"
          @click="add_leave_type"
        />
      </div>
    </div>
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
      add_leave_type_loading: false,
      delete_leave_type_dialog: false,
      selected_leave_type: null,
      leave_config_dialog: false,
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

    this.team.profiles.sort((a, b) => a.link.position - b.link.position)

    for (let profile of this.team.profiles) {
      profile.quotas = this.quotas.filter(l => l.profile == profile.id)

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
  },

  methods: {
    open_delete_leave_type_dialog(leave_type) {
      this.selected_leave_type = leave_type
      this.delete_leave_type_dialog = true
    },

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
      this.add_leave_type_loading = true

      let request = await this.$http.post('leaves', {
        'action': 'add_leave_type',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'year': this.$current_year,
      })

      let new_leave_type = request.new_leave_type
      let new_quotas = request.new_quotas

      this.config.leave_types.push(new_leave_type)

      for (let profile of this.team.profiles) {
        let new_quota = new_quotas.find(q => q.profile == profile.id)

        profile.quotas.push(new_quota)
      }

      this.add_leave_type_loading = false
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
