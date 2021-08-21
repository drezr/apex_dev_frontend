<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title my-3">
        {{ team.name }}
      </div>

      <NavigationBar class="mb-3" />

      <div class="calendar-frame" ref="frame">
        <div class="calendar-days">
          <div class="calendar-spacer"></div>

          <DayCell
            v-for="date in calendar"
            :key="date.day_number + $tool.gen_uid()"
            :type="'day'"
            :date="date"
            @open_detail_dialog="open_detail_dialog"
          />
        </div>

        <div
          class="calendar-profiles"
          v-for="profile in profiles"
          :key="profile.id"
        >
          <Profile :profile="profile" />

          <DayCell
            v-for="date in profile.dates"
            :key="date.day_number + $tool.gen_uid()"
            :type="'cell'"
            :date="date"
            @open_detail_dialog="open_detail_dialog"
          />

          <Profile :profile="profile" />
        </div>

        <div class="calendar-days">
          <div class="calendar-spacer"></div>

          <DayCell
            v-for="date in calendar"
            :key="date.day_number + $tool.gen_uid()"
            :type="'day'"
            :date="date"
            @open_detail_dialog="open_detail_dialog"
          />
        </div>
      </div>
      
      <div class="today-frame" ref="today_frame"></div>
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
  >
    <v-text-field
      v-if="detail_object.type == 'cell' && $has_xs(['watcher_is_editor'])"
      v-model="detail_object.cell.short"
      outlined
      clearable
      autofocus
      :label="lang.views.watcher.calendar_detail_short[lg]"
      :hint="lang.views.watcher.calendar_detail_short_hint[lg]"
      persistent-hint
      class="mt-3"
    ></v-text-field>

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

      <VueDraggable
        v-model="detail_full_object.children"
        @change="update_detail_objects_position"
        :animation="100"
        easing="cubic-bezier(1, 0, 0, 1)"
        handle=".handle"
      >
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
      </VueDraggable>

      <div class="d-flex justify-end" v-if="$has_xs(['watcher_is_editor'])">
        <div class="command-buttons-bg detail-command-buttons-position">
          <CustomButton
            :icon="'mdi-pencil'"
            :fab="true"
            :color="'teal'"
            :dark="true"
            :elevation="1"
            :small="true"
            :tooltip="lang.views.watcher.calendar_edit_elements_tooltip[lg]"
            class="mr-2"
            @click="detail_edit_mode = !detail_edit_mode"
          />


          <!-- :outlined="detail_edit_mode" re-render all components-->

          <CustomButton
            :icon="'mdi-plus'"
            :fab="true"
            :color="'green'"
            :dark="true"
            :elevation="1"
            :small="true"
            :tooltip="lang.views.watcher.calendar_add_element_tooltip[lg]"
            :menus="detail_add_element_menu"
            @menu_action="detail_action($event)"
          />
        </div>
      </div>
    </div>
  </CustomDialog>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import DayCell from '@/views/watcher/components/DayCell.vue'
import Profile from '@/views/watcher/components/Profile.vue'
import Part from '@/components/Part.vue'
import Task from '@/components/Task.vue'
import Call from '@/components/Call.vue'
import File from '@/components/File.vue'
import Note from '@/components/Note.vue'

export default {
  name: 'CalendarView',

  components: {
    NavigationBar,
    DayCell,
    Profile,
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
      calendar: Array(),
      profiles: Array(),
      detail_dialog: false,
      detail_dialog_loading: true,
      detail_object: null,
      detail_full_object: null,
      detail_edit_mode: false,
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
    this.rrs = this.request.rrs

    this.cvs = this.get_cvs()
    this.calendar = this.set_calendar()
    this.profiles = this.set_profiles()

    this.loading = false

    setTimeout(() => this.set_today_frame(), 500)
  },

  computed: {
    dates() {
      let month = this.$current_month - 1
      let year = this.$current_year

      let date = new Date(year, month, 1)
      let dates = Array()
      
      while (date.getMonth() === month) {
        let obj = new Date(date)
        let day_number = obj.getDate()
        let name_short = obj.toLocaleDateString(
          'fr-FR', {weekday: 'short'}).slice(0, -1)
        let name_long = obj.toLocaleDateString('fr-FR', {weekday: 'long'})

        dates.push({
          'name_short': name_short,
          'name_long': name_long,
          'day_number': day_number,
          'month': month + 1,
          'year': year,
          'is_rr': false,
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
        let profile = this.profiles.find(p => p.id == this.detail_object.cell.profile)

        txt = txt.replace('@@@', this.$tool.format_date(date))
        txt = txt.replace('###', profile.name)

        return txt
      }

      return ''
    },

    detail_add_element_menu() {
      let menu = [
        {
          'icon': 'mdi-file',
          'name': this.lang.views.watcher.calendar_add_file[this.lg],
          'color': 'pink',
          'action': 'add_file',
        },
        {
          'icon': 'mdi-chat',
          'name': this.lang.views.watcher.calendar_add_note[this.lg],
          'color': 'text--darken-2 cyan',
          'action': 'add_note',
        },
      ]

      if (this.detail_object.type == 'cell') {
        menu.unshift({
          'icon': 'mdi-hammer-screwdriver',
          'name': this.lang.views.watcher.calendar_add_call[this.lg],
          'color': 'indigo',
          'action': 'add_call',
        })
      }

      return menu
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
        profiles = profiles.filter(p => p.id == this.$logged_profile.id)
      }

      profiles = profiles.filter(p => p.link.watcher_is_visible)

      for (let profile of profiles) {
        profile.dates = this.$tool.deepcopy(this.dates)
        profile.cells = this.cells.filter(c => c.profile == profile.id)

        for (let cell of profile.cells) {
          let cell_day = new Date(cell.date).getDate()
          let date = profile.dates.find(d => d.day_number == cell_day)

          date.cell = cell
        }

        for (let date of profile.dates) {
          let rr = this.rrs.find((rr) => {
            return new Date(rr.date).getDate() == date.day_number
          })

          if (rr) {
            date.is_rr = true
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

    async open_detail_dialog(date) {
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
      }

      let children = this.$tool.get_fused_children(this.detail_full_object)
      children = this.$tool.deepcopy(children)
      this.$set(this.detail_full_object, 'children', children)
      this.detail_full_object.parts.sort((a, b) => a.shift.shift.localeCompare(b.shift.shift))

      this.detail_dialog_loading = false
    },

    async detail_action(action) {
      console.log(action)
    },

    async update_detail_objects_position() {
      console.log('position updated')
    },

    set_today_frame() {
      setTimeout(() => {
        // To avoid errors on fast previous/next clicks
        if (this.$refs.frame) {
          let today = new Date()

          if (today.getMonth() + 1 == this.$current_month &&
              today.getFullYear() == this.$current_year) {
            let today_frame = this.$refs.today_frame
            let calendar_frame = this.$refs.frame
            let calendar_height = calendar_frame.offsetHeight

            today_frame.style.height = (calendar_height + 4) + 'px'
            today_frame.style.top = '-' + (calendar_height + 3) + 'px'
            today_frame.style.left = ((today.getDate() * 47) + 165) + 'px'
          }
        }
      })
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.calendar-frame {
  margin-left: 5px;
}

.calendar-spacer {
  min-width: 207px;
  min-height: 40px;
}

.calendar-days {
  display: flex;
}

.calendar-profiles {
  display: flex;
}

.detail-no-element {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 160px;
}

.detail-command-buttons-position {
  position: relative;
  top: 15px;
  left: 20px;
}

.today-frame {
  position: relative;
  background-color: green;
  width: 49px;
  pointer-events: none;
  z-index: 1;
  border-radius: 5px;
}

</style>
