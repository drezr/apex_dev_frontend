<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" style="padding-bottom: 50px;">
      <div class="team-title mt-3">
        {{ profile.name }}
      </div>

      <NavigationBar class="mb-6" />

      <div v-if="($has_xs(['watcher_can_see_quotas']) || profile.id == $logged_profile.id) && selected_type">
        <div  class="d-flex flex-wrap justify-center">
          <div
            v-for="(leave_type, i) in leaves_data.filter(l => l.kind != 'ignore')"
            :key="i"
          >
            <v-tooltip
              :top="true"
              color="black"
              :disabled="leave_type.desc ? false : true"
            >
              <template v-slot:activator="{ on: show_tooltip }">
                <div
                  class="leave-frame"
                  :class="selected_type == leave_type.code ? 'leave-outlined' : ''"
                  @click="selected_type = leave_type.code"
                  v-on="show_tooltip"
                >
                  <div class="leave-upper">
                    <div
                      style="height: 100%;"
                      class="lighten-4 text--darken-4 white--text d-flex justify-center align-center"
                      :class="[
                        leave_type.color,
                        leave_type.color + '--text',
                      ]"
                    >
                      <b>{{ leave_type.code.toUpperCase() }}</b>
                    </div>
                  </div>

                  <div
                    class="leave-lower"
                  >
                    {{ computed_quotas[leave_type.code.toLowerCase()] }}
                  </div>
                </div>
              </template>

              <span>{{ leave_type.desc }}</span>
            </v-tooltip>
          </div>
        </div>

        <div v-for="(months, type) in sorted_detailed_quotas" :key="type">
          <div v-if="selected_type.toLowerCase() == type">
            <div
              class="quota-table mt-8 blue lighten-3 blue--text text--darken-4"
              v-if="!leaves_data.find(ld => ld.code == selected_type).kind.includes('counter')"
            >
              <div class="quota-table-row">
                <div class="quota-table-title">{{ lang.views.watcher.quota_base_quota[lg] }}</div>
                <div class="quota-table-value">{{ base_quotas[type] }}</div>
              </div>
            </div>

            <div v-for="(month, number) in months" :key="number">
              <div v-if="month.length > 0">
                <div
                  class="text-center mt-2 mb-2"
                  :class="number < 13 ? '' : 'mt-6'"
                >
                  <b>{{ months_name[number] }}</b>
                </div>

                <div class="quota-table">
                  <div
                    v-for="(cell, i) in month"
                    :key="i"
                    class="quota-table-parent"
                  >
                    <div class="quota-table-row">
                      <div
                        class="d-flex flex-grow-1"
                        v-if="number < 13"
                      >
                        <div
                          class="quota-table-presence"
                          :class="select_text_color(cell['presence'])"
                        >
                          {{ cell['presence'] ? cell['presence'].toUpperCase() : '' }}
                        </div>

                        <div
                          class="quota-table-presence"
                          :class="select_text_color(cell['absence'])"
                        >
                          {{ cell['absence'] ? cell['absence'].toUpperCase() : '' }}
                        </div>

                        <div class="quota-table-date">
                          <small class="grey--text">
                            {{ get_day_name(cell['date']) }}
                          </small>

                          {{ $tool.format_date(cell['date']) }}
                        </div>
                      </div>


                      <div
                        class="d-flex flex-grow-1 justify-center align-center"
                        v-else
                      >
                        <b>28 {{ lang.generic.absences[lg].toLowerCase() }}</b>
                      </div>

                      <div class="quota-table-value">
                        <div 
                          class="quota-table-value-color lighten-4 text--darken-4 m-1"
                          :class="String(cell['count']).charAt(0) == '-' ? 'red red--text' : 'green green--text'"
                        >
                          {{ cell['count'] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="quota-table mt-5 green lighten-3 green--text text--darken-4"
              v-if="['saturday', 'sunday', 'holiday', 'hour'].includes(leaves_data.find(ld => ld.code.toLowerCase() == selected_type.toLowerCase()).kind)"
            >
              <div class="quota-table-row">
                <div class="quota-table-title">{{ lang.views.watcher.quota_obtained[lg] }}</div>
                <div class="quota-table-value">{{ obtained[type] }}</div>
              </div>
            </div>

            <div
              class="quota-table red lighten-3 red--text text--darken-4"
              :class="['saturday', 'sunday', 'holiday', 'hour'].includes(leaves_data.find(ld => ld.code.toLowerCase() == selected_type.toLowerCase()).kind) ? 'mt-2' : 'mt-5'"
            >
              <div class="quota-table-row">
                <div class="quota-table-title">{{ lang.views.watcher.quota_took[lg] }}</div>
                <div class="quota-table-value">{{ Math.abs(took[type]) }}</div>
              </div>
            </div>

            <div
              class="quota-table mt-5 mb-8 blue lighten-3 blue--text text--darken-4"
              v-if="!leaves_data.find(ld => ld.code == selected_type).kind.includes('counter')"
            >
              <div class="quota-table-row">
                <div class="quota-table-title">{{ lang.views.watcher.quota_left[lg] }}</div>
                <div class="quota-table-value">{{ computed_quotas[type] }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!($has_xs(['watcher_can_see_quotas']) || profile.id == $logged_profile.id) && selected_type" class="pa-16 text-center">
        {{ lang.views.watcher.quota_no_access[lg] }}
      </div>

      <div v-else class="pa-16 text-center">
        {{ lang.views.watcher.leaves_no_leave_set_1[lg] }}<br>
        <small v-if="$has_xs(['is_manager'])">{{ lang.views.watcher.quota_add_leave_type[lg] }}</small>
      </div>
    </div>
  </transition>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'

export default {
  name: 'Quota',

  components: {
    NavigationBar,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      profile: Object(),
      base_quotas: Array(),
      computed_quotas: Array(),
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
      hex_colors: {
        'white': '#FFFFFF',
        'red': '#D50000',
        'pink': '#E91E63',
        'purple': '#9C27B0',
        'deep-purple': '#673AB7',
        'indigo': '#3F51B5',
        'light-blue': '#03A9F4',
        'cyan': '#00BCD4',
        'teal': '#009688',
        'green': '#4CAF50',
        'light-green': '#8BC34A',
        'lime': '#CDDC39',
        'yellow': '#FFEB3B',
        'amber': '#FFC107',
        'orange': '#FF9800',
        'deep-orange': '#FF5722',
        'brown': '#795548',
        'blue-grey': '#607D8B',
      },
      selected_type: null,
      sorted_detailed_quotas: Object(),
      took: Object(),
      obtained: Object(),
      months_name: Object(),
    }
  },

  async created() {
    this.request = await this.$http.get('quota', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'profile_id': this.$current_profile_id,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.base_quotas = this.request.base_quotas
    this.computed_quotas = this.request.computed_quotas
    this.detailed_quotas = this.request.detailed_quotas
    this.profile = this.request.profile
    this.config = this.request.config

    this.config.leave_types.sort((a, b) => a.position - b.position)

    this.leaves_data = this.config.leave_types
    this.leaves_data = this.leaves_data.filter(l => !['recovery', 'presence'].includes(l.kind))
    this.leaves_data.sort((a, b) => a.position - b.position)

    if (this.leaves_data.length > 0) {
      this.selected_type = this.leaves_data[0]['code']
    }
    

    for (let code in this.base_quotas) {
      this.base_quotas[code] = Number(this.base_quotas[code])
      this.computed_quotas[code] = Number(this.computed_quotas[code])
    }

    for (let type in this.detailed_quotas) {
      this.sorted_detailed_quotas[type] = Object()
      this.sorted_detailed_quotas[type]['13'] = Array()
      this.obtained[type] = 0
      this.took[type] = 0

      for (let i = 1; i <= 13; i++) {
        this.sorted_detailed_quotas[type][i] = Array()
      }

      this.detailed_quotas[type].sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })

      for (let cell of this.detailed_quotas[type]) {
        let date = new Date(cell.date)
        let month = date.getMonth() + 1

        if (Number(cell.count) > 0) {
          this.obtained[type] += Number(cell.count)
        }

        else if (Number(cell.count) < 0) {
          this.took[type] += Number(cell.count)
        }

        if (date.getFullYear() > 1970) {
          this.sorted_detailed_quotas[type][month].push(cell)
        }

        else {
          this.sorted_detailed_quotas[type]['13'].push(cell)
        }
      }

      this.obtained[type] = Math.round(this.obtained[type] * 100) / 100
      this.took[type] = Math.round(this.took[type] * 100) / 100
    }

    this.months_name = {
      1: this.lang.generic.january[this.lg],
      2: this.lang.generic.february[this.lg],
      3: this.lang.generic.march[this.lg],
      4: this.lang.generic.april[this.lg],
      5: this.lang.generic.may[this.lg],
      6: this.lang.generic.june[this.lg],
      7: this.lang.generic.july[this.lg],
      8: this.lang.generic.august[this.lg],
      9: this.lang.generic.september[this.lg],
      10: this.lang.generic.october[this.lg],
      11: this.lang.generic.november[this.lg],
      12: this.lang.generic.december[this.lg],
      13: this.lang.generic.absences[this.lg],
    }

    this.loading = false
  },

  computed: {

  },

  methods: {
    select_text_color(value) {
      let color = 'red--text text--accent-4'

      if (value) {
        if (this.config) {
          let config = this.config

          let ignore_types = config.leave_types.filter(
            l => l.kind == 'ignore')

          let presence_types = config.leave_types.filter(
            l => l.kind == 'presence')

          let ignore_type_match = ignore_types.find(t => value.toUpperCase().includes(t.code.toUpperCase()))

          let presence_type_match = presence_types.find(t => value.toUpperCase().includes(t.code.toUpperCase()))

          if (presence_type_match && !ignore_type_match) {
            color = `${presence_type_match.color}--text text--darken-2`
          }
        }
      }

      return color
    },

    get_day_name(date) {
      let day = new Date(date).toLocaleString('fr-FR', { weekday: 'long' })

      return day.charAt(0).toUpperCase() + day.slice(1)
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.leave-frame {
  border: 1px grey solid;
  border-radius: 7px;
  overflow: hidden;
  width: 60px;
  margin: 2px 5px;
  background-color: rgba(150, 150, 150, 0.1);
  cursor: pointer;
}

.leave-upper {
  border-radius: 5px;
  overflow: hidden;
  height: 33px;
  margin: 1px;
  text-shadow: 1px 1px 0px white;
}

.leave-lower {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 31px;
  width: 52px;
  margin: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  outline-color: orange;
  text-align: center;
}

.leave-outlined {
  box-shadow: 0px 0px 0px 4px orange; 
}

.quota-table {
  box-shadow: 0 0px 0px 2px rgb(235, 235, 235);
  width: 375px;
  margin: auto;
  text-align: center;
  border-radius: 5px;
}

.quota-table-row {
  display: flex;
  height: 50px;
}

.quota-table-parent:not(:first-child) {
  border-top: 1px rgba(0, 0, 0, 0.2) solid;
}

.quota-table-presence {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  font-weight: bold;
  font-size: 13px;
  background-color: #f1f1f1;
}

.quota-table-presence:first-child {
  border-right: 1px rgba(0, 0, 0, 0.2) solid;
}

.quota-table-title {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  border-right: 1px rgba(0, 0, 0, 0.2) solid;
  font-weight: bold;
}

.quota-table-date {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  border-left: 1px rgba(0, 0, 0, 0.2) solid;
  border-right: 1px rgba(0, 0, 0, 0.2) solid;
  line-height: 15px;
  padding-bottom: 8px;
}

.quota-table-value {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  width: 100px;
  font-weight: bold;
}

.quota-table-value-color {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
}

.cursor-default {
  cursor: default !important;
}

</style>
