<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" style="height: 300px;">
      <div class="team-title">
        {{ team.name }}
      </div>

      <NavigationBar
        @toggle-palette="palette = !palette"
        @toggle-decimal-calculator="decimal_calculator = !decimal_calculator"
      />

      <Palette
        v-if="palette"
        class="mb-4"
        @pick-color="palette_pick_color($event)"
      />

      <div class="d-flex justify-center mb-3">
        <DecimalCalculator v-if="decimal_calculator" />
      </div>

      <div class="calendar-frame" ref="frame" v-if="profiles.length > 0">
        <div class="calendar-days calendar-days-top">
          <div class="calendar-spacer d-flex align-center justify-center">
            <CustomButton
              @click="show_all_quotas"
              :color="'blue'"
              :small="true"
              :padding_x="5"
              :dark="true"
              :text="lang.views.watcher.calendar_show_all_quotas[lg]"
            />
          </div>

          <DayCell
            v-for="date in calendar"
            :key="date.day_number + 88888888888888"
            :type="'day'"
            :date="date"
            @open_detail_dialog="open_detail_dialog"
          />
        </div>

        <div
          class="calendar-profiles"
          v-for="(profile, y) in profiles"
          :key="y"
        >
          <Profile :profile="profile" :start="true" />

          <DayCell
            v-for="(date, x) in profile.dates"
            :key="x + y"
            :type="'cell'"
            :date="date"
            :parent_cpnt="$current_instance"
            @open_detail_dialog="open_detail_dialog"
            :x="x"
            :y="y"
          />

          <Profile :profile="profile" :start="false" />
        </div>

        <div class="calendar-days calendar-days-bottom">
          <div class="calendar-spacer"></div>

          <DayCell
            v-for="date in calendar"
            :key="date.day_number +  99999999999"
            :type="'day'"
            :date="date"
            :parent_cpnt="$current_instance"
            @open_detail_dialog="open_detail_dialog"
          />
        </div>
      </div>
      
      <div
        class="today-frame"
        ref="today_frame"
        v-if="profiles.length > 0"
      ></div>

      <div v-if="profiles.length == 0" class="pa-16 text-center">
        {{ lang.views.watcher.calendar_no_profile[lg] }}
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
  >
    <v-text-field
      v-if="detail_object.type == 'cell' && $has_xs(['watcher_is_editor'])"
      :value="detail_object_short"
      @input="detail_object.cell.short = $event"
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

      <Loader :size="50" :width="7" class="my-3" v-if="add_child_loading" />

      <div class="d-flex justify-end" v-if="$has_xs(['watcher_is_editor'])">
        <div class="command-buttons-bg detail-command-buttons-position">
          <CustomButton
            v-if="$store.state.copying_element && $store.state.copying_element.type == 'call'"
            :icon="'mdi-content-copy'"
            :fab="true"
            :small="true"
            :color="'indigo'"
            :dark="!copy_loading"
            :disabled="copy_loading"
            :loading="copy_loading"
            :elevation="1"
            :tooltip="this.lang.generic.to_copy[this.lg]"
            class="mr-2"
            @click="copy_call"
            :tooltip_top="true"
          />

          <CustomButton
            v-if="$store.state.moving_element && $store.state.moving_element.type == 'call'"
            :icon="'mdi-flip-to-front'"
            :fab="true"
            :small="true"
            :color="'light-blue'"
            :dark="!has_moving_call"
            :disabled="has_moving_call"
            :loading="move_loading"
            :elevation="1"
            :tooltip="this.lang.generic.move[this.lg]"
            class="mr-2"
            @click="move_call"
            :tooltip_top="true"
          />

          <CustomButton
            v-if="detail_full_object.type == 'cell'"
            :icon="'mdi-clock-time-four-outline'"
            :fab="true"
            :dark="true"
            :color="'blue-grey'"
            :elevation="1"
            :small="true"
            class="mr-2"
            :tooltip="lang.views.radium.log_title[lg]"
            @click="open_log_dialog(detail_full_object.id)"
          />

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
            :outlined="detail_edit_mode"
          />

          <!-- :outlined="detail_edit_mode" re-render all components-->

          <CustomButton
            :icon="'mdi-plus'"
            :fab="true"
            :color="'green'"
            :dark="!add_child_loading"
            :elevation="1"
            :small="true"
            :tooltip="lang.views.watcher.calendar_add_element_tooltip[lg]"
            :menus="detail_add_element_menu"
            @menu_action="detail_action($event)"
            :disabled="add_child_loading"
          />
        </div>
      </div>
    </div>
  </CustomDialog>


  <CustomDialog
    :open="log_dialog"
    :width="800"
    :title_text="lang.views.radium.log_title[lg]"
    :title_icon="'mdi-clock-time-four-outline'"
    @cancel="log_dialog = false"
  >
    <Loader
      :size="100"
      :width="10"
      :mt="120"
      :mb="100"
      v-if="log_dialog_loading"
    />

    <div class="mt-3" v-else>
      <v-simple-table v-if="logs.length > 0">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                {{ lang.generic.log_edited_by[lg] }}
              </th>
              <th class="text-left">
                {{ lang.generic.log_new_value[lg] }}
              </th>
              <th class="text-left">
                {{ lang.generic.log_old_value[lg] }}
              </th>
              <th class="text-left">
                {{ lang.generic.log_datetime[lg] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, i) in logs" :key="i">
              <td><b>{{ log.author }}</b></td>
              <td class="work-log-cell">{{ log.new_value }}</td>
              <td class="work-log-cell">{{ log.old_value }}</td>
              <td>{{ $tool.format_datetime(log.date) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <div class="pa-16 d-flex justify-center" v-else>
        {{ lang.views.radium.log_no_log[lg] }}
      </div>
    </div>
  </CustomDialog>

  <input type="file"
    class="d-none"
    ref="file-input"
    v-on:change="add_file($event)"
  />
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import DecimalCalculator from '@/components/DecimalCalculator.vue'
import DayCell from '@/views/watcher/components/DayCell.vue'
import Profile from '@/views/watcher/components/Profile.vue'
import Part from '@/components/Part.vue'
import Task from '@/components/Task.vue'
import Call from '@/components/Call.vue'
import File from '@/components/File.vue'
import Note from '@/components/Note.vue'
import Palette from '@/components/Palette.vue'

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
    Palette,
    DecimalCalculator,
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
      leave_config: Object(),
      trigger_all_quotas: false,
      trigger_all_quotas_loading: false,
      palette: false,
      palette_color: 'red',
      decimal_calculator: false,
      current_position: [0, 0],
      add_child_loading: false,
      palette_mode: 'border',
      detail_object_short: '',
      update_timer: null,
      copy_loading: false,
      move_loading: false,
      log_dialog: false,
      log_dialog_loading: false,
      logs: Array(),
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
    this.leave_config = this.request.leave_config

    this.leave_config.leave_types.sort((a, b) => a.position - b.position)

    this.cvs = this.get_cvs()
    this.calendar = this.set_calendar()
    this.profiles = this.set_profiles()

    this.type_names = this.get_type_names()

    this.loading = false

    setTimeout(() => this.set_today_frame(), 500)

    this.handler = (e) => {
      this.keyboard_event(e)
    }

    window.addEventListener('keyup', this.handler)
  },

  beforeDestroy() {
    window.removeEventListener('keyup', this.handler)
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
          'action': 'file',
        },
        {
          'icon': 'mdi-chat',
          'name': this.lang.views.watcher.calendar_add_note[this.lg],
          'color': 'text--darken-2 cyan',
          'action': 'note',
        },
      ]

      if (this.detail_object.type == 'cell') {
        menu.unshift({
          'icon': 'mdi-hammer-screwdriver',
          'name': this.lang.views.watcher.calendar_add_call[this.lg],
          'color': 'indigo',
          'action': 'call',
        })
      }

      return menu
    },

    max_x() {
      return this.dates.length - 1
    },

    max_y() {
      return (this.profiles.length * 2) - 1
    },

    has_moving_call() {
      if (this.detail_full_object) {
        let has_call = this.detail_full_object.children.find(t => t.id == this.$store.state.moving_element.id && t.type == this.$store.state.moving_element.type)

        return has_call ? true : false
      }

      return false
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

      if (this.$has_xs(['watcher_can_see_cells']) || this.$logged_profile.can_see_calendars) {
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

    keyboard_event(e) {
      // left
      if (e.which === 37 && this.current_position[0] > 0) {
        this.current_position = [
          this.current_position[0] - 1,
          this.current_position[1]
        ]
      }

      // right
      else if (e.which === 39 && this.current_position[0] < this.max_x) {
        this.current_position = [
          this.current_position[0] + 1,
          this.current_position[1]
        ]
      }

      // up
      else if (e.which === 38 && this.current_position[1] > 0) {
        this.current_position = [
          this.current_position[0],
          this.current_position[1] - 1
        ]
      }
      // down
      else if (e.which === 40 && this.current_position[1] < this.max_y) {
        this.current_position = [
          this.current_position[0],
          this.current_position[1] + 1
        ]
      }
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

      this.detail_full_object.parts.sort((a, b) => {
        if (a.shift.shift && b.shift.shift) {
          return a.shift.shift.localeCompare(b.shift.shift)
        }
        
        return 0
      })

      this.detail_dialog_loading = false
    },

    async detail_action(type) {
      if (type == 'file') {
        this.$refs['file-input'].click()
      }

      else {
        this.add_child_loading = true

        let request = await this.$http.post('element', {
          'action': 'create',
          'element_type': type,
          'view': this.$current_view,
          'parent_type': this.detail_full_object.type,
          'parent_id': this.detail_full_object.id,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
        })

        this.add_child_loading = false

        let child = request[type]
        child.children = Array()

        this.detail_full_object.children.push(child)
        this.detail_edit_mode = true

        if (type == 'call') {
          this.detail_object.cell.has_call = true
        }

        else {
          this.detail_object[this.detail_object.type].has_content = true
        }
      }
    },

    add_file(e) {
      this.add_child_loading = true

      this.$tool.get_file_data(e, async (data) => {
          data.append('action', 'create')
          data.append('element_type', 'file')
          data.append('kind', 'day_cell_file')
          data.append('view', this.$current_view)
          data.append('parent_type', this.detail_full_object.type)
          data.append('parent_id', this.detail_full_object.id)
          data.append('team_id', this.$current_team_id)
          data.append('app_id', this.$current_app_id)

        let request = await this.$http.post('element', data)

        this.add_child_loading = false

        let child = request['file']
        child.children = Array()

        this.detail_full_object.children.push(child)
        this.detail_edit_mode = true
        this.detail_object[this.detail_object.type].has_content = true
      })
    },

    async update_detail_objects_position() {
      let position_updates = this.$set_position_updates(this.detail_full_object)

      await this.$http.post('element', {
        'action': 'position',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': this.detail_full_object.type,
        'element_id': this.detail_full_object.id,
        'position_updates': position_updates,
      })
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

    get_type_names() {
      let presence_names = Array()
      let absence_names = Array()

      for (let item in this.leave_config) {
        if (item.includes('type')) {
          let i = item.split('_')[1]
          let name = this.leave_config['leave_' + i + '_name']
          let type = this.leave_config['leave_' + i + '_type']

          if (type == 'presence') {
            presence_names.push(name)
          }

          else {
            absence_names.push(name)
          }
        }
      }

      return {
        'presence': presence_names,
        'absence': absence_names,
      }
    },

    async show_all_quotas() {
      this.trigger_all_quotas_loading = true

      await this.$http.post('leaves', {
        'action': 'create_quotas',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'year': this.$current_year,
      })

      this.trigger_all_quotas = true

      setTimeout(() => this.trigger_all_quotas = false, 10)
      setTimeout(() => this.trigger_all_quotas_loading = false, 10)
    },

    async copy_call() {
      this.copy_loading = true
      let call = this.$store.state.copying_element

      let request = await this.$http.post('element', {
        'action': 'copy',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'new_parent_type': 'cell',
        'new_parent_id': this.detail_full_object.id,
        'element_type': call.type,
        'element_id': call.id,
      })

      let children = this.$tool.get_fused_children(request.call)
      this.$set(request.call, 'children', children)

      this.detail_full_object.children.push(request.call)

      this.$store.commit('set_copying_element', null)

      for (let profile of this.profiles) {
        for (let date of profile.dates) {
          if (date.cell.id == this.detail_full_object.id) {
            date.cell.has_call = true
          }
        }
      }

      this.copy_loading = false
    },

    async move_call() {
      this.move_loading = true
      let call = this.$store.state.moving_element
      let old_parent = this.$store.state.moving_old_parent
      let new_parent = this.detail_full_object

      let request = await this.$http.post('element', {
        'action': 'move',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_type': 'cell',
        'parent_id': old_parent.id,
        'new_parent_type': 'cell',
        'new_parent_id': new_parent.id,
        'element_type': 'call',
        'element_id': call.id,
      })

      let children = this.$tool.get_fused_children(request.call)
      this.$set(request.call, 'children', children)

      this.detail_full_object.children.push(request.call)

      this.$store.commit('set_moving_element', null)
      this.$store.commit('set_moving_old_parent', null)

      for (let profile of this.profiles) {
        for (let date of profile.dates) {
          if (date.cell.id == new_parent.id) {
            date.cell.has_call = true
          }

          if (date.cell.id == old_parent.id) {
            if (old_parent.children.filter(c => c.type == 'call').length == 1) {
              date.cell.has_call = false
            }
          }
        }
      }

      this.move_loading = false
    },

    async open_log_dialog(cell_id) {
      this.log_dialog = true
      this.log_dialog_loading = true

      this.request = await this.$http.get('logs', {
        'cell_id': cell_id,
      })

      this.logs = this.request.logs

      for (let log of this.logs) {
        log.old_value = log.old_value.replaceAll('&#%$', ' | ')
        log.new_value = log.new_value.replaceAll('&#%$', ' | ')
      }

      this.log_dialog_loading = false
    },
  },

  watch: {
    current_position() {
      let x = this.current_position[0]
      let y = this.current_position[1]

      document.getElementById(`${x}_${y}`).focus()
    },
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
  position: sticky;
  display: flex;
  z-index: 3;
}

.calendar-days-top {
  top: 0;
}

.calendar-days-bottom {
  bottom: 0;
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
