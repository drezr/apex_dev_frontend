<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" class="board-printable-area">
      <div class="d-flex flex-start align-center my-1 mx-3 text-h5">
        <CustomButton
          :icon="'mdi-chevron-left'"
          :height="40"
          :outlined="true"
          class="mr-3 no-print"
          @click="$router.push(`/team/${$current_team_id}/watcher/${$current_app_id}/calendar/month/${$current_month}/year/${$current_year}`)"
        />

        {{ team.name }}
        {{ app.name ? `(${app.name})` : '' }} -
        {{ lang.generic.calendar[lg] }}
        {{ $tool.format_date_month_name_year(`${$current_year}-${$current_month}`, lg) }}

        <CustomButton
          :icon="'mdi-printer'"
          :height="40"
          :outlined="true"
          class="ml-3 no-print"
          @click="print_document"
        />
      </div>


      <div class="d-flex mt-5">
        <div class="spacer"></div>
        <div
          v-for="(day, i) in dates"
          :key="i" class="day"
          :class="[is_cv(day.day) ? 'yellow accent-3 black--text' :
                         'grey darken-4 white--text']"
        >
          <span>
          <b>{{ day.name_short.toUpperCase() }}</b><br>
          {{ day.day_number }}
          </span>
        </div>
      </div>


      <div>
        <div class="_row" v-for="(profile, x) in profiles" :key="x">
          <div
            class="profile lighten-4"
            :class="[
              profile.link.watcher_color == 'red accent-4' ? 'red' : profile.link.watcher_color
            ]"
          >
            <b>{{ profile.name }}</b><br>
            <div style="font-size: 11px; line-height: 12px;">
              {{ profile.grade }}<br>
              {{ profile.ident }}<br>
              {{ profile.phone }}<br>
            </div>
          </div>

          <div
            v-for="(date, y) in profile.dates"
            :key="y"
            class="cell"
            :class="'presence-' + color(date)"
            :style="date.cell.color ? 
            `border-color: ${hex_colors[date.cell.color]}; border-width: 1px;
             box-shadow: 0 0 0 1px ${hex_colors[date.cell.color]};` : ''
            "
          >
            <div
              class="presence lighten-3"
              :class="[
                select_color(date.cell.presence),
                date.cell.presence_color,
                date.cell.presence_color ? 'cell-text-stroke' : '',
              ]"
            >
              {{ date.cell.presence ? date.cell.presence.toUpperCase() : '' }}
            </div>

            <div
              class="absence lighten-3"
              :class="[
                select_color(date.cell.absence),
                date.cell.absence_color,
                date.cell.absence_color ? 'cell-text-stroke' : '',
              ]"
            >
              {{ date.cell.absence ? date.cell.absence.toUpperCase() : '' }}
            </div>
            <div class="_info">
              {{ date.cell.short }}
            </div>
          </div>
        </div>
      </div>


      <div class="d-flex">
        <div class="spacer"></div>
        <div
          v-for="(day, i) in dates"
          :key="i" class="day"
          :class="[is_cv(day.day) ? 'yellow accent-3 black--text' :
                         'grey darken-4 white--text']"
        >
          <span>
          <b>{{ new Date(day.year, day.month, day.day_number).toLocaleString('fr-fr', { 'weekday': 'short' }).toUpperCase().slice(0, -1) }}</b><br>
          {{ day.day_number }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</div>

</template>


<script>

export default {
  name: 'CalendarPrintable',

  components: {

  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      calendar: Array(),
      profiles: Array(),
      detail_dialog: false,
      detail_dialog_loading: true,
      detail_object: null,
      detail_full_object: null,
      detail_edit_mode: false,

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
    }
  },

  async created() {
    this.request = await this.$http.get('calendar', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.days = this.request.days
    this.cells = this.request.cells
    this.holidays = this.request.holidays

    this.cvs = this.get_cvs()
    this.calendar = this.set_calendar()
    this.profiles = this.set_profiles()

    this.loading = false
  },

  computed: {
    dates() {
      let month = this.$current_month - 1
      let year = this.$current_year

      let date = new Date(year, month, 1)
      let dates = Array()
      
      while (date.getMonth() === month) {
        let language_code = this.lg + '-' + this.lg.toUpperCase()
        
        let obj = new Date(date)
        let day_number = obj.getDate()
        let name_short_en = obj.toLocaleDateString(
          'en-EN', {weekday: 'short'})
        let name_long = obj.toLocaleDateString(language_code, {weekday: 'long'})
        let name_short = name_long.substring(0,3)

        dates.push({
          'name_short': name_short,
          'name_long': name_long,
          'name_short_en': name_short_en,
          'day_number': day_number,
          'month': month + 1,
          'year': year,
          'is_holiday': false,
          'is_cv': false,
          'cv_step': null,
          'week_step': null,
          'type': null,
          'day': {
            'date': `${year}-${month + 1}-${day_number}`,
            'has_content': false,
          },
          'cell': {
            'date': `${year}-${month + 1}-${day_number}`,
            'presence': '',
            'absence': '',
            'short': '',
            'color': '',
            'has_content': false,
            'has_call': false,
            'profile': false,
          },
        })

        date.setDate(date.getDate() + 1)
      }

      return dates
    },
  },

  methods: {
    set_calendar() {
      let calendar = this.$tool.deepcopy(this.dates)

      for (let day of this.days) {
        let day_day = new Date(day.date).getDate()
        let _day = calendar.find(d => d.day_number == day_day)

        _day.day = day
      }

      for (let day of calendar) {
        let cv = this.cvs.find(cv => cv.day == day.day_number)

        if (cv) {
          day.is_cv = true
          day.cv_step = cv.step
        }

        let date = new Date(day.year, day.month - 1,  day.day_number)
        let day_name = date.toLocaleDateString('en-en', { weekday: 'long' })

        if (day_name == 'Monday') {
          day.week_step = date.getWeek()
        }

        day.type = 'day'
      }

      return calendar
    },

    set_profiles() {
      let profiles = this.$tool.deepcopy(this.team.profiles)

      if (this.$has_xs(['watcher_can_see_cells'])) {
        profiles.sort((a, b) => a.link.position - b.link.position)
      }

      else {
        if (!this.$logged_profile) {
          while (!this.$logged_profile) {
            this.$logged_profile
          }
        }

        profiles = profiles.filter(p => p.id == this.$logged_profile.id)
      }

      profiles = profiles.filter(p => p.link.watcher_is_printable)

      for (let profile of profiles) {
        profile.dates = this.$tool.deepcopy(this.dates)
        profile.cells = this.cells.filter(c => c.profile == profile.id)

        for (let cell of profile.cells) {
          let cell_day = new Date(cell.date).getDate()
          let date = profile.dates.find(d => d.day_number == cell_day)

          date.cell = cell
        }

        for (let date of profile.dates) {
          let holiday = this.holidays.find((holiday) => {
            return new Date(holiday.date).getDate() == date.day_number
          })

          if (holiday) {
            date.is_holiday = true
          }

          date.type = 'cell'
          date.cell.profile = profile.id
        }
      }

      return profiles
    },

    get_cvs() {
      let cv_start = new Date('January 20, 2020 00:00:00')
      let cvs = Array()
      let step = 2

      for (let i = 0; i < 1000; i++) {
        step++

        if (step == 14) step = 1

        cv_start.setDate(cv_start.getDate() + 28)

        if (cv_start.getMonth() + 1 == this.$current_month &&
            cv_start.getFullYear() == this.$current_year) {
          cvs.push({'step': step, 'day': cv_start.getDate()})
        }

        if (cv_start.getFullYear() > this.$current_year) break
      }

      return cvs
    },

    print_document() {
      print()
    },

    select_color(value) {
      let color = 'red--text text--accent-4'

      if (value) {
        value = value.toUpperCase()

        if (value.includes('P')) color = 'green--text text--darken-2'
        if (value.includes('PN')) color = 'blue--text text--darken-4'
        if (value.includes('AP')) color = 'red--text text--darken-4'
      }

      return color
    },

    is_cv(day) {
      for (let cv in this.cvs) {
        let date = new Date(day.date)

        if (date.getDate() == this.cvs[cv].day) {
          return true
        }
      }

      return false
    },

    color(cell) {
      for (let holiday of this.holidays) {
        if (holiday.date == cell.cell.date) {
          return 'holi'
        }
      }

      if (cell.name_short == 'sam') return 'sat'
      else if (cell.name_short == 'dim') return 'sun'
      else return 'week'
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.content {
  margin: 15px;
}

.spacer {
  min-width: 171px;
  max-width: 171px;
  height: 40px;
}

._row {
  display: flex;
  border-top: 3px black solid;
  border-left: 2px black solid;
  border-right: 2px black solid;
  flex-wrap: nowrap;
  min-width: fit-content;
  max-width: fit-content;
}

._row:last-child {
  border-bottom: 2px black solid;
}

.day {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px white solid;
  line-height: 18px;
  width: 44px;
  min-width: 44px;
  height: 40px;
  margin-left: 1px;
  font-size: 14px;
}

.day:not(:last-child) {
  border-right: none;
}

.profile {
  border-left: 1px black solid;
  border-right: 1px black solid;
  width: 170px;
  min-width: 170px;
  height: 60px;
  font-size: 14px;
  padding: 3px;
  line-height: 18px;
}

.cell {
  border-left: 1px black solid;
  border-right: 1px black solid;
  width: 45px;
  min-width: 45px;
  height: 60px;
}

.presence {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
  height: 25px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
}

.absence {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px rgba(0, 0, 0, 0.1) solid;
  height: 25px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
}

._info {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 10px;
  line-height: 10px;
  font-size: 10px;
  font-weight: bold;
  color: blue;
  white-space: nowrap;
}

.presence-sat {
  border-bottom: 1px #B0BEC5 solid;
  background-color: #CEDFEF;
}

.presence-sun {
  border-bottom: 1px #B0BEC5 solid;
  background-color: #EFD9CE;
}

.presence-holi {
  border-bottom: 1px #B0BEC5 solid;
  background-color: #ebca8f;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.cell-text-stroke {
  text-shadow: 0px 0px 3px white;
}


</style>
