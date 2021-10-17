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

      <div v-if="config.leave_count > 0" class="d-flex justify-center mt-3">
        <div>
          <Leave
            v-for="(profile, i) in team.profiles"
            :key="i"
            :profile="profile"
            :parent="$current_component"
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
    :width="900"
    :title_text="lang.views.watcher.leaves_config[lg]"
    :title_icon="'mdi-tune-vertical'"
    @cancel="leave_config_dialog = false"
  >
    <div class="mt-6">
      <div class="text-center">
        {{ lang.views.watcher.leaves_leave_count[lg] }}
      </div>

      <div class="d-flex justify-center mb-9">
        <CustomButton
          @click="update_leave_count('minus')"
          :tooltip="lang.views.watcher.leaves_remove_leave_type[lg]"
          :icon="'mdi-minus'"
          :small_fab="true"
          :disabled="config.leave_count == 0"
        ></CustomButton>

        <div class="text-h5 mx-3">{{ config.leave_count }}</div>

        <CustomButton
          @click="update_leave_count('plus')"
          :tooltip="lang.views.watcher.leaves_add_leave_type[lg]"
          :icon="'mdi-plus'"
          :small_fab="true"
          :disabled="config.leave_count == 20"
        ></CustomButton>
      </div>

      <div
        v-for="(index, i) in config.leave_count"
        :key="i"
        class="d-flex align-center mb-3"
      >
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <div
              class="leave-color-circle"
              :class="config['leave_' + i + '_color']"
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
                color == config['leave_' + i + '_color'] ? 'leave-color-circle-selected': '',
              ]"
              @click="set_leave_color(color, i)"
            ></div>
          </div>
        </v-menu>

        <v-text-field
          v-model="config['leave_' + i + '_name']"
          :label="lang.views.watcher.leaves_leave_name[lg]"
          type="text"
          class="mx-3"
          outlined
          hide-details
          style="min-width: 120px; max-width: 120px; width: 120px;"
        />

        <v-text-field
          v-model="config['leave_' + i + '_desc']"
          :label="lang.views.watcher.leaves_leave_desc[lg]"
          type="text"
          class="mx-3"
          outlined
          hide-details
          style="min-width: 310px; max-width: 310px; width: 310px;"
        />

        <v-select
          v-model="config['leave_' + i + '_type']"
          :items="leave_types"
          item-text="name"
          item-value="value"
          :label="lang.views.watcher.leaves_leave_type[lg]"
          outlined
          hide-details
          class="mx-3"
          style="min-width: 190px; max-width: 190px; width: 190px;"
          @change="update('type', i)"
        ></v-select>

        <v-checkbox
          v-model="config['leave_' + i + '_visible']"
          :label="lang.generic.visible[lg]"
          class="mx-3"
          hide-details
          style="position: relative; top: -10px;"
          :disabled="['counter', 'presence', 'recovery', 'ignore'].includes(config['leave_' + i + '_type'])"
        ></v-checkbox>
      </div>
    </div>
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

    this.team.profiles.sort((a, b) => a.link.position - b.link.position)

    for (let profile of this.team.profiles) {
      profile.quotas = this.quotas.find(l => l.profile == profile.id)

      for (let i = 0; i < 20; i++) {
        profile.quotas['type_' + i] = Number(profile.quotas['type_' + i])
      }
    }

    this.loading = false
  },

  computed: {
    leaves_data() {
      let leaves_data = Array()

      for (let i = 0; i < this.config.leave_count; i++) {
        leaves_data.push({
          'generic_name': 'leave_' + i,
          'name': this.config['leave_' + i + '_name'],
          'desc': this.config['leave_' + i + '_desc'],
          'type': this.config['leave_' + i + '_type'],
          'color': this.config['leave_' + i + '_color'],
          'visible': this.config['leave_' + i + '_visible'],
        })
      }

      return leaves_data
    },

    leave_types() {
      return [
        {'value': 'normal_leave', 'name': this.lang.generic.normal_leave[this.lg]},
        {'value': 'credit_day', 'name': this.lang.generic.credit_day[this.lg]},
        {'value': 'variable_leave', 'name': this.lang.generic.variable_leave[this.lg]},
        {'value': 'saturday', 'name': this.lang.generic.saturday[this.lg]},
        {'value': 'sunday', 'name': this.lang.generic.sunday[this.lg]},
        {'value': 'holiday', 'name': this.lang.generic.holiday[this.lg]},
        {'value': 'hour', 'name': this.lang.generic.hour[this.lg]},
        {'value': 'counter', 'name': this.lang.generic.counter[this.lg]},
        {'value': 'presence', 'name': this.lang.generic.presence[this.lg]},
        {'value': 'recovery', 'name': this.lang.generic.recovery[this.lg]},
        {'value': 'ignore', 'name': this.lang.generic.ignore[this.lg]},
      ]
    },
  },

  methods: {
    update_leave_count(action) {
      if (action == 'minus') {
        if (this.config.leave_count > 0) {
          this.config.leave_count--
        }
      }

      else if (action == 'plus') {
        if (this.config.leave_count < 20) {
          this.config.leave_count++
        }
      }
    },

    set_leave_color(color, i) {
      this.config['leave_' + i + '_color'] = color
    },

    update(field, i) {
      let value = `leave_${i}_${field}`

      if (field == 'type' && ['counter', 'presence', 'recovery', 'ignore'].includes(this.config[value])) {
        this.config[`leave_${i}_visible`] = false
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
