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
        <div
          v-for="leave_type in config.leave_types"
          :key="leave_type.id"
          class="d-flex align-center mb-3"
        >
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
                v-for="(color, x) in leave_colors"
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
            :items="leave_kinds"
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
            @click="open_delete_leave_type_dialog(leave_type)"
          />
        </div>
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
    @confirm="delete_leave_type()"
  >
  </CustomDialog>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import Leave from '@/views/watcher/components/Leave.vue'

export default {
  name: 'Leaves',

  components: {
    NavigationBar,
    Leave,
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

    set_leave_color(leave_type, color) {
      leave_type.color = color

      this.send_update(leave_type)
    },

    update(leave_type) {
      if (leave_type.kind && (['presence', 'recovery', 'ignore'].includes(leave_type.kind) || leave_type.kind.includes('counter'))) {
        leave_type.visible = false
      }

      this.send_update(leave_type)
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

    async send_update(leave_type) {
      if (!this.is_updating) {
        clearInterval(this.update_timer)
      }

      this.update_timer = setTimeout(async () => {
        await this.$http.post('leaves', {
          'action': 'update_config',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'value': leave_type,
        })
      }, 100)
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

    async delete_leave_type() {
      this.config.leave_types = this.config.leave_types.filter(
        l => l != this.selected_leave_type)

      this.delete_leave_type_dialog = false

      await this.$http.post('leaves', {
        'action': 'delete_leave_type',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'value': this.selected_leave_type,
      })

      this.selected_leave_type = null
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
