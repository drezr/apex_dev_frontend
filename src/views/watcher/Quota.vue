<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title my-3">
        {{ profile.name }}
      </div>

      <div class="d-flex justify-center">
        <div
          v-for="(leave_type, i) in leaves_data"
          :key="i"
        >
          <v-tooltip
            :top="true"
            color="black"
          >
            <template v-slot:activator="{ on: show_tooltip }">
              <div
                class="leave-frame"
                :class="selected_type == leave_type.generic_name ? 'leave-outlined' : ''"
                @click="selected_type = leave_type.generic_name"
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
                    <b>{{ leave_type.name }}</b>
                  </div>
                </div>

                <div
                  class="leave-lower"
                >
                  {{ computed_quota[leave_type.generic_name] }}
                </div>
              </div>
            </template>

            <span>{{ leave_type.desc }}</span>
          </v-tooltip>
        </div>
      </div>

    <div v-for="(months, type) in sorted_detail_quota" :key="type">
      <div v-if="selected_type == type">
        <div class="quota-table mt-8 blue lighten-3 blue--text text--darken-4">
          <div class="quota-table-row">
            <div class="quota-table-title">Droit de base</div>
            <div class="quota-table-value">{{ base_quota[type] }}</div>
          </div>
        </div>

        <div v-for="(month, number) in months" :key="number">
          <div v-if="month.length > 0">
            <div class="text-center mt-2 mb-2">
              <b>{{ months_name[number] }}</b>
            </div>

            <div class="quota-table">
              <div v-for="(cell, i) in month" :key="i" class="quota-table-parent">
                <div class="quota-table-row">
                  <div class="quota-table-presence">
                    {{ cell['presence'] ? cell['presence'].toUpperCase() : '' }}
                  </div>
                  <div class="quota-table-presence">
                    {{ cell['absence'] ? cell['absence'].toUpperCase() : '' }}
                  </div>
                  <div class="quota-table-date">
                    {{ $tool.format_date(cell['date']) }}
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


<!--                 <div class="quota-table-row" v-if="!cell['year']">
                  <div class="quota-table-title">
                    {{ type == 'cv' ? '28' : '14' }} absences
                  </div>
                  <div class="quota-table-value">
                    <div 
                      class="quota-table-value-color red lighten-4 red--text text--darken-4 m-1"
                    >
                    {{ String(cell['value']).charAt(0) == '-' ? '' : '+' }}{{ cell['value'] }}
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <div
          class="quota-table mt-5 green lighten-3 green--text text--darken-4"
          v-if="['saturday', 'sunday', 'holiday', 'hour'].includes(leaves_data.find(ld => ld.generic_name == type).type)"
        >
          <div class="quota-table-row">
            <div class="quota-table-title">Obtenus</div>
            <div class="quota-table-value">{{ obtained[type] }}</div>
          </div>
        </div>

        <div
          class="quota-table red lighten-3 red--text text--darken-4"
          :class="['saturday', 'sunday', 'holiday', 'hour'].includes(leaves_data.find(ld => ld.generic_name == type).type) ? 'mt-2' : 'mt-5'"
        >
          <div class="quota-table-row">
            <div class="quota-table-title">Pris</div>
            <div class="quota-table-value">{{ Math.abs(took[type]) }}</div>
          </div>
        </div>

        <div class="quota-table mt-5 mb-8 blue lighten-3 blue--text text--darken-4">
          <div class="quota-table-row">
            <div class="quota-table-title">Reste</div>
            <div class="quota-table-value">{{ computed_quota[type] }}</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </transition>
</div>

</template>


<script>

export default {
  name: 'Quota',

  components: {
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      profile: Object(),
      base_quota: Array(),
      computed_quota: Array(),
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
      selected_type: null,
      sorted_detail_quota: Object(),
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
    this.base_quota = this.request.base_quota
    this.computed_quota = this.request.computed_quota
    this.detail_quota = this.request.detail_quota
    this.profile = this.request.profile
    this.config = this.request.config
    
    this.leaves_data = this.get_leaves_data()
    this.selected_type = this.leaves_data[0]['generic_name']

    for (let i = 0; i < 20; i++) {
      this.base_quota['type_' + i] = Number(this.base_quota['type_' + i])
      this.computed_quota['type_' + i] = Number(this.computed_quota['type_' + i])
    }


    for (let type in this.detail_quota) {
      this.sorted_detail_quota[type] = Object()
      this.obtained[type] = 0
      this.took[type] = 0

      for (let i = 1; i <= 13; i++) {
        this.sorted_detail_quota[type][i] = Array()
      }

      this.detail_quota[type].sort((a, b) => {
        return new Date(b.date) + new Date(a.date)
      })

      for (let cell of this.detail_quota[type]) {
        let date = new Date(cell.date)
        let month = date.getMonth() + 1

        if (Number(cell.count) > 0) {
          this.obtained[type] += Number(cell.count)
        }

        else if (Number(cell.count) < 0) {
          this.took[type] += Number(cell.count)
        }

        this.sorted_detail_quota[type][month].push(cell)
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
      13: this.lang.generic.absence[this.lg],
    }

    this.loading = false
  },

  computed: {

  },

  methods: {
    get_leaves_data() {
      let leaves_data = Array()

      for (let i = 0; i < this.config.leave_count; i++) {
        if (!['presence', 'recovery', 'ignore'].includes(this.config['leave_' + i + '_type'])) {
          leaves_data.push({
            'generic_name': 'type_' + i,
            'name': this.config['leave_' + i + '_name'],
            'desc': this.config['leave_' + i + '_desc'],
            'type': this.config['leave_' + i + '_type'],
            'color': this.config['leave_' + i + '_color'],
            'visible': this.config['leave_' + i + '_visible'],
          })
        }
      }

      return leaves_data
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
  margin: 0px 5px;
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
  width: 500px;
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
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  border-left: 1px rgba(0, 0, 0, 0.2) solid;
  border-right: 1px rgba(0, 0, 0, 0.2) solid;
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
