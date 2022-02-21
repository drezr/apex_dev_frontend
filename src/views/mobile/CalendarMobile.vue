<template>

<div class="d-flex flex-column align-center">
  <TimeTravel class="works-mobile-timetravel mt-3 mb-6" />

  <Loader
    v-if="loading"
    class="mt-16"
    :size="70"
  />

  <transition name="fade">
    <div v-if="!loading">
      <div class="d-flex justify-center">
        <div
          class="d-flex flex-wrap"
          style="max-width: 357px;"
        >
          <div
            v-for="(date, i) in dates"
            :key="i"
            style="padding: 3px 3px 1px 1px; border-radius: 7px;"
            :style="date.day_number == today_date.getDate() && date.month == today_date.getMonth() + 1 ? 'background-color: green;' : ''"
          >
            <div
              v-if="!date.year"
              class="mobile-cell-dummy"
            ></div>

            <div v-else>
              <DayCell
                :type="'day'"
                :date="date"
                class="mb-1"
              />

              <DayCell
                :type="'cell'"
                :date="date"
                :parent_cpnt="$current_instance"
                @open_detail_dialog="open_detail_dialog"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>




  <CustomDialog
    v-if="detail_dialog"
    :open="detail_dialog"
    :width="600"
    :title_text="lang.views.watcher.calendar_detail_title[lg]"
    :subtitle_text="get_detail_subtitle"
    :title_bg_color="'grey lighten-3'"
    :hide_action="true"
    :move_window="true"
    @cancel="detail_dialog = false"
    class="mobile-detail-dialog"
  >
    <Loader 
      v-if="detail_dialog_loading"
      :size="80"
      :width="8"
      :mt="40"
      :mb="40"
    />

    <div v-if="!detail_dialog_loading" class="mt-5">
      <div class="detail-no-element" v-if="
        detail_full_object.children.length == 0 &&
        detail_full_object.parts.length == 0"
      >
       {{ lang.views.watcher.calendar_detail_no_element[lg] }}
      </div>

      <Part
        v-for="(part, i) in detail_full_object.parts"
        :key="i"
        :self="part"
        :parent="detail_full_object"
        class="my-6"
      />

      <v-divider
        v-if="
          detail_full_object.parts.length > 0 &&
          detail_full_object.children.length > 0
        "
        class="my-6"
      ></v-divider>

      <div
        v-for="(child, i) in detail_full_object.children"
        :key="i"
        class="d-flex flex-column"
      >
        <Task
          v-if="child.type == 'task'"
          :self="child"
          :parent="detail_full_object"
          class="mb-6"
        />

        <Note
          v-if="child.type == 'note'"
          :self="child"
          :parent="detail_full_object"
          class="mb-6"
        />

        <Call
          v-if="child.type == 'call'"
          :self="child"
          :parent="detail_full_object"
          class="mt-3 mb-6"
        />

        <File
          v-if="child.type == 'file'"
          :self="child"
          :parent="detail_full_object"
          class="mb-6"
        />
      </div>

    </div>
  </CustomDialog>


</div>

</template>


<script>

import TimeTravel from '@/components/TimeTravel.vue'
import DayCell from '@/views/watcher/components/DayCell.vue'
import Part from '@/components/Part.vue'
import Task from '@/components/Task.vue'
import Call from '@/components/Call.vue'
import File from '@/components/File.vue'
import Note from '@/components/Note.vue'

export default {
  name: 'CalendarMobile',

  components: {
    TimeTravel,
    DayCell,
    Part,
    Task,
    Call,
    File,
    Note,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      cells: Array(),
      days: Array(),
      dates: Array(),
      detail_dialog: false,
      detail_dialog_loading: true,
      detail_object: null,
      detail_full_object: null,
      detail_edit_mode: false,
      profiles: Array(),
      today_date: null
    }
  },

  async created() {
    let request = await this.$http.get('calendarmobile', {
      'profile_id': this.$logged_profile.id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.cells = request.cells
    this.holidays = request.holidays
    this.leave_config = request.leave_config
    this.leave_config.leave_types.sort((a, b) => a.position - b.position)

    this.today_date = new Date()

    this.cvs = this.get_cvs()
    this.dates = this.get_dates()
    this.days = this.get_days()
    this.cells = this.set_cells()

    let day_step = 0

    for (let date of this.dates) {
      if (date.name_short_en == 'Mon') break
      else day_step++
    }

    for (let i = 1; i <= 7 - day_step; i++) {
      this.dates.unshift({})
    }

    let last_date = this.dates[this.dates.length - 1]
    let day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    day_step = 0

    for (let day_name of day_names) {
      if (last_date.name_short_en != day_name) {
        day_step++
      }

      else {
        break
      }
    }

    for (let i = 1; i <= 6 - day_step; i++) {
      this.dates.push({})
    }

    this.loading = false
  },

  computed: {
    get_detail_subtitle() {
      if (this.detail_object && this.detail_object.type == 'day') {
        let txt = this.lang.views.watcher.calendar_detail_subtitle_day[this.lg]
        let date = this.detail_object.day.date

        txt = txt.replace('@@@', this.$tool.format_date(date))

        return txt
      }

      else if (this.detail_object && this.detail_object.type == 'cell') {
        let txt = this.lang.views.watcher.calendar_detail_subtitle_cell[this.lg]
        let date = this.detail_object.cell.date
        let profile = this.$logged_profile

        txt = txt.replace('@@@', this.$tool.format_date(date))
        txt = txt.replace('###', profile.name)

        return txt
      }

      return ''
    },
  },

  methods: {
    get_dates() {
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
        let name_short = obj.toLocaleDateString(
          language_code, {weekday: 'short'}).slice(0, -1)
        let name_long = obj.toLocaleDateString(language_code, {weekday: 'long'})

        dates.push({
          'name_short_en': name_short_en,
          'name_short': name_short,
          'name_long': name_long,
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
            'presence_color': '',
            'absence_color': '',
            'has_content': false,
            'has_call': false,
            'profile': false,
          },
        })

        date.setDate(date.getDate() + 1)
      }

      return dates
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

    get_days() {
      for (let day of this.dates) {
        let cv = this.cvs.find(cv => cv.day == day.day_number)

        if (cv) {
          day.is_cv = true
          day.cv_step = cv.step
        }

        let date = new Date(day.year, day.month - 1,  day.day_number)
        let day_name = date.toLocaleDateString('en-en', { weekday: 'long' })

        if (day_name == 'Monday') {
          day.week_step = date.getWeek() + 1
        }
      }
    },

    set_cells() {
      let cells = Array()

      for (let cell of this.cells) {
        let cell_day = new Date(cell.date).getDate()
        let date = this.dates.find(d => d.day_number == cell_day)

        date.cell = cell
      }

      for (let date of this.dates) {
        let holiday = this.holidays.find((holiday) => {
          return new Date(holiday.date).getDate() == date.day_number
        })

        if (holiday) {
          date.is_holiday = true
        }

        date.type = 'cell'
        date.cell.profile = this.$logged_profile.id
      }

      return cells
    },

    async open_detail_dialog(date) {
      this.detail_object_short = ''
      this.detail_dialog_loading = true
      this.detail_object = date
      this.detail_dialog = true

      if (this.detail_object.type == 'day') {
        let request = await this.$http.get('day', {
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'date': this.detail_object.day.date,
        })

        date.day.id = request.day.id
        this.detail_full_object = request.day
      }

      else if (this.detail_object.type == 'cell') {
        let request = await this.$http.get('cell', {
          'profile_id': this.detail_object.cell.profile,
          'date': this.detail_object.cell.date,
        })

        date.cell.id = request.cell.id
        this.detail_full_object = request.cell
        this.detail_object_short = this.detail_full_object.short
      }

      let children = this.$tool.get_fused_children(this.detail_full_object)
      children = this.$tool.deepcopy(children)
      this.$set(this.detail_full_object, 'children', children)
      this.detail_full_object.parts.sort((a, b) => a.shift.shift.localeCompare(b.shift.shift))

      this.detail_dialog_loading = false
    },
  },

  watch: {

  },
}

</script>


<style>

.mobile-detail-dialog .v-dialog>.v-card>.v-card__subtitle, .v-dialog>.v-card>.v-card__text {
  padding-left: 10px !important;
  padding-right: 10px !important;
  min-height: 400px;
}

</style>


<style scoped>

.detail-no-element {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 160px;
}

.mobile-cell-dummy {
  width: 47px;
  height: 118px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

</style>
