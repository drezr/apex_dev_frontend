<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title">
        {{ team.name }}
        {{ app.name ? `(${app.name})` : '' }}
      </div>

      <NavigationBar
        @open-customize-dialog="customize_dialog = true"
        @open-filter-dialog="filter_dialog = true"
        @open-messages-dialog="messages_dialog = true"
        @toggle-palette="palette = !palette"
        @add-work="add_work"
      />

      <Palette
        v-if="palette"
        class="mt-2"
      />

      <div class="works-frame" v-if="filtered_works.length > 0">
        <VueDraggable
          v-model="filtered_works"
          @change="update_work_position"
          :animation="100"
          easing="cubic-bezier(1, 0, 0, 1)"
          handle=".work-drag-button"
        >
          <Work
            v-for="(work, i) in filtered_works"
            :key="i + rerender_count"
            :self="work"
            class="ma-3"
          />
        </VueDraggable>
      </div>

      <div
        v-if="filtered_works.length == 0 && active_filters.length == 0"
        class="d-flex justify-center align-center my-16"
      >
        {{ lang.views.radium.no_works[lg] }}
      </div>

      <div
        v-if="filtered_works.length == 0 && active_filters.length > 0"
        class="d-flex justify-center align-center my-16"
      >
        {{ lang.views.radium.no_filters_result[lg] }}
      </div>
    </div>
  </transition>

  <CustomDialog
    :open="customize_dialog"
    :width="800"
    :title_text="lang.views.radium.customize_tooltip[lg]"
    :title_icon="'mdi-tune-vertical'"
    @cancel="customize_dialog = false"
    :move_window="true"
  >
    <VueDraggable
      v-model="columns"
      @change="update_columns"
      :animation="100"
      easing="cubic-bezier(1, 0, 0, 1)"
      handle=".cursor-move"
    >
      <div
        v-for="(column, i) in columns"
        :key="i"
        class="works-customize-row"
      >
        <v-icon class="cursor-move handle mr-3 pink--text">
          mdi-drag-horizontal-variant
        </v-icon>

        <div style="width: 200px; text-align: center;" class="black--text">
          <b>{{ lang.views.radium['column_title_' + column.name][lg] }}</b>
        </div>

        <v-text-field
          v-model="column.width"
          :label="lang.generic.column_width[lg]"
          type="number"
          class="mx-3"
          outlined
          hide-details
        />

        <v-text-field
          v-model="column.textsize"
          :label="lang.generic.text_size[lg]"
          type="number"
          class="mx-3"
          outlined
          hide-details
        />

        <v-checkbox
          v-model="column.visible"
          :label="lang.generic.visible[lg]"
          class="mx-3"
          hide-details
          style="position: relative; top: -10px;"
        ></v-checkbox>
      </div>
    </VueDraggable>
  </CustomDialog>

  <CustomDialog
    :open="messages_dialog"
    :width="600"
    :title_text="lang.views.radium.messages_dialog_title[lg]"
    :title_icon="'mdi-android-messages'"
    @cancel="messages_dialog = false"
  >
    <div v-if="messages.length == 0" class="d-flex justify-center pa-16">
      {{ lang.views.radium.messages_no_message[lg] }}
    </div>

    <div
      v-for="(message, i) in messages"
      :key="i"
      class="message-frame"
    >
      <WorkSimple :self="message.work" />

      <v-alert
        border="right"
        :color="message.priority == 'important' ? 'red' : 'blue'"
        :icon="message.priority == 'important' ? 'mdi-alert' : 'mdi-information'"
        class="mt-3 mb-3 darken-2"
        dark
        prominent
      >
        <div class="px-3" style="white-space: pre;">
          <big>{{ message.message }}</big>
        </div>

        <div class="text-right" style="position: relative; top: 10px;">
          <small>{{ by_author_on_date(message.date, message.author) }}</small>
        </div>
      </v-alert>

      <div class="text-right">
        <CustomButton
          :text="lang.generic.acquit[lg]"
          :icon="'mdi-check'"
          :color="'green'"
          :dark="true"
          @click="acquit_dialog = true"
        />

        <CustomDialog
          :open="acquit_dialog"
          :width="500"
          :title_text="lang.generic.are_you_sure[lg]"
          :cancel_icon="'mdi-close'"
          :cancel_text="lang.generic.cancel[lg]"
          :confirm_icon="'mdi-check'"
          :confirm_text="lang.generic.acquit[lg]"
          :confirm_color="'green'"
          @cancel="acquit_dialog = false"
          @confirm="acquit_message(message.id)"
        ></CustomDialog>
      </div>
    </div>
  </CustomDialog>

  <CustomDialog
    :open="filter_dialog"
    :width="650"
    :title_text="lang.views.radium.filter_works_tooltip[lg]"
    :title_icon="'mdi-filter'"
    @cancel="filter_dialog = false"
    :move_window="true"
  >
    <div
      v-for="(column, i) in [{'name': 'dates'}, {'name': 'schedules'}].concat(columns.filter(c => !excluded_filters.includes(c.name)))"
      :key="i"
      class="works-customize-row"
    >
      <div style="width: 200px; text-align: center;" class="black--text">
        <b>{{ lang.views.radium['column_title_' + column.name][lg] }}</b>
      </div>

      <v-autocomplete
        :items="get_filters(column)"
        :no-data-text="lang.generic.no_result[lg]"
        prepend-icon="mdi-filter"
        outlined
        hide-details
        class="py-2"
        chips
        small-chips
        deletable-chips
        dense
        multiple
        clearable
        :ref="'filter_' + i"
        @change="set_filters($event, i, column)"
        style="width: 360px;"
      ></v-autocomplete>
    </div>
  </CustomDialog>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import Work from '@/views/radium/components/Work.vue'
import WorkSimple from '@/components/WorkSimple.vue'
import Palette from '@/components/Palette.vue'

export default {
  name: 'Works',

  components: {
    NavigationBar,
    Work,
    WorkSimple,
    Palette,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      add_loading: false,
      cached_teams: Array(),
      circles_loading: true,
      circles: Array(),
      customize_dialog: false,
      filter_dialog: false,
      team: Object(),
      app: Object(),
      config: Object(),
      works: Array(),
      columns: Array(),
      messages: Array(),
      messages_loading: true,
      messages_dialog: false,
      acquit_dialog: false,
      palette: false,
      palette_color: 'white',
      palette_mode: 'works',
      active_filters: Array(),
      excluded_filters: [
        'shifts',
        'files',
        'limits',
        's460s',
      ],
      filtered_works: Array(),
      rerender_count: 0,
    }
  },

  async created() {
    this.request = await this.$http.get('works', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.config = this.request.config
    this.works = this.request.works
    this.columns = this.get_columns()

    this.filtered_works = this.get_filtered_works()

    this.loading = false

    this.request = await this.$http.get('messages', {
      'app_id': this.$current_app_id,
    })

    this.messages = this.request.messages
    this.messages_loading = false

    this.request = await this.$http.get('apps')
    this.circles = this.request.circles

    for (let circle of this.circles) {
      circle.teams.sort((a, b) => a.name.localeCompare(b.name))

      for (let team of circle.teams) {
        team.apps.sort((a, b) => {
          a = a.name || ''
          b = b.name || ''
          
          return a.localeCompare(b)
        })
      }
    }

    this.circles_loading = false
  },

  computed: {

  },

  methods: {
    async add_work() {
      this.add_loading = true

      let request = await this.$http.post('works', {
        'action': 'create',
        'element_type': 'work',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'date': `${this.$current_year}-${this.$current_month}-01`
      })

      let work = request.work
      work.newly_created = true

      this.works.push(work)

      this.add_loading = false
    },

    update_work_position() {

    },

    get_columns() {
      let columns = Array()

      for (let key in this.config) {
        for (let value of ['visible', 'width', 'position', 'textsize']) {
          if (key.includes(value) && !key.includes('printable_')) {
            let name = key.replace('_' + value, '')
            let item = columns.find(i => i.name == name)

            if (!item) {
              item = {'name': name}
              columns.push(item)
            }

            item[value] = this.config[key]
            break
          }
        }
      }

      columns.sort((a, b) => a.position - b.position)

      return columns
    },

    update_columns() {

    },

    get_filters(column) {
      let filters = Array()
      let key = column.name

      for (let work of this.works) {
        if (key == 'schedules') {
          for (let shift of work.shifts) {
            if (!filters.includes(shift.shift) && shift.shift) {
              filters.push(shift.shift)
            }
          }
        }

        else if (key == 'dates') {
          for (let shift of work.shifts) {
            if (!filters.includes(shift.date) && shift.date) {
              filters.push(this.$tool.format_date(shift.date))
            }
          }
        }

        else if (!filters.includes(work[key]) && work[key]) {
          filters.push(work[key])
        }
      }

      filters.sort((a, b) => a.localeCompare(b))

      return filters
    },

    set_filters(event, i, column) {
      this.$refs['filter_' + i][0].lazySearch = ''

      let filter_exists = this.active_filters.find(
        f => f.column == column.name)

      if (event.length == 0) {
        if (filter_exists) {
          this.active_filters = this.active_filters.filter(
            f => f.column !== column.name)
        }
      }

      else {
        if (!filter_exists) {
          this.active_filters.push({
            'column': column.name,
            'filters': event,
          })
        }

        else {
          filter_exists.filters = event
        }
      }

      this.filtered_works = this.get_filtered_works()
    },

    get_filtered_works() {
      let works = this.works

      if (this.active_filters.length > 0) {
        for (let filter of this.active_filters) {
          if (filter.column == 'schedules') {
            works = works.filter(w => {
              return w.shifts.find(s => {
                return filter.filters.find(f => f == s.shift)
              })
            })
          }

          else if (filter.column == 'dates') {
            works = works.filter(w => {
              return w.shifts.find(s => {
                return filter.filters.find(f => {
                  return f == this.$tool.format_date(s.date)
                })
              })
            })
          }

          else {
            works = works.filter(w => {
              return filter.filters.includes(w[filter.column])
            })
          }
        }
      }

      works.sort((a, b) => a.link.position - b.link.position)

      return works
    },

    by_author_on_date(date, author) {
      let txt = this.lang.generic.by_author_on_date[this.lg]

      txt = txt.replace('@@@', this.$tool.format_date(date))
      txt = txt.replace('###', author)

      return txt
    },

    acquit_message(message_id) {
      this.messages = this.messages.filter(m => m.id !== message_id)
      this.acquit_dialog = false
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.works-frame {

}

.works-customize-row {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px grey solid;
  padding-bottom: 10px;
}

.message-frame {
  margin-top: 9px;
  padding: 9px;
  border: 1px orange solid;
  border-radius: 5px;

}

</style>
