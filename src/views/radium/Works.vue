<template>

<div style="width: 100%;">
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade" style="width: 100%;">
    <div v-if="!loading">
      <div
        class="team-title"
        style="height: 40px; margin-top: 20px; justify-content: start;"
        :style="'width:' + doc_width + 'px;'"
      >
        <div class="works-navigation-inner">
          {{ team.name }}
          {{ app.name ? `(${app.name})` : '' }}
        </div>
      </div>

      <div
        class="works-navigation"
        :style="'width:' + doc_width + 'px;'"
      >
        <div class="works-navigation-inner">
          <NavigationBar
            @open-customize-dialog="customize_dialog = true"
            @open-filter-dialog="filter_dialog = true"
            @open-sort-dialog="sort_dialog = true"
            @open-messages-dialog="open_message_dialog()"
            @toggle-palette="palette = !palette"
            @edit-all="toggle_edit_all()"
            @clear-all-is-edited="clear_all_is_edited()"
            @add-work="add_work"
          />

          <Palette
            v-if="palette"
            class="mt-2"
          />
        </div>
      </div>

      <div class="works-frame" v-if="filtered_works.length > 0">
        <Work
          v-for="work in filtered_works"
          :key="work.id"
          :self="work"
          :parent_cpnt="$current_instance"
          class="ma-3"
        />
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

      <div class="d-flex justify-end" v-if="$is_editor && (show_move_command || show_copy_command)">
        <div class="works-command-buttons-position command-buttons-bg">
          <CustomButton
            v-if="show_move_command"
            :icon="'mdi-flip-to-front'"
            :fab="true"
            :color="'light-blue'"
            :dark="!moving_disabled"
            :disabled="moving_disabled"
            :loading="moving_work_loading"
            :elevation="1"
            :tooltip="lang.generic.move[lg]"
            @click="move_work"
            :tooltip_top="true"
            :class="show_copy_command ? 'mr-1' : ''"
          />

          <CustomButton
            v-if="show_copy_command"
            :icon="'mdi-content-copy'"
            :fab="true"
            :color="'indigo'"
            :dark="true"
            :loading="copying_work_loading"
            :elevation="1"
            :tooltip="lang.generic.to_copy[lg]"
            @click="copy_work"
            :tooltip_top="true"
          />
        </div>
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
      v-model="column_configs"
      @change="update_columns"
      :animation="100"
      easing="cubic-bezier(1, 0, 0, 1)"
      handle=".cursor-move"
      class="works-customize-scrollbar"
    >
      <div
        v-for="(column, i) in column_configs"
        :key="i"
        class="works-customize-row"
      >
        <v-icon class="cursor-move handle mr-3 pink--text">
          mdi-drag-horizontal-variant
        </v-icon>

        <div style="min-width: 145px; text-align: center;" class="black--text">
          <b>{{ lang.views.radium['column_title_' + column.name][lg] }}</b>
        </div>

        <v-text-field
          v-model="column.width"
          :label="lang.generic.column_width[lg]"
          type="number"
          class="mx-3"
          outlined
          hide-details
          @input="update_config()"
          style="min-width: 200px;"
        />

        <v-text-field
          v-model="column.textsize"
          :label="lang.generic.text_size[lg]"
          type="number"
          class="mx-3"
          outlined
          hide-details
          @input="update_config();"
          :style="column.name == 'files' ? 'visibility: hidden;' : ''"
          style="min-width: 200px;"
        />

        <v-checkbox
          v-model="column.visible"
          :label="lang.generic.visible[lg]"
          class="mx-3"
          hide-details
          @change="update_config()"
          style="position: relative; top: -10px;"
        ></v-checkbox>
      </div>
    </VueDraggable>
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
      v-for="(column, i) in [{'name': 'dates'}, {'name': 'schedules'}].concat(column_configs.filter(c => !excluded_filters.includes(c.name) && c.visible))"
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

  <CustomDialog
    :open="sort_dialog"
    :width="800"
    :title_text="lang.views.radium.sort_works_tooltip[lg]"
    :title_icon="'mdi-sort'"
    @cancel="sort_dialog = false"
  >
    <div class="d-flex justify-center align-center mb-3">
      <v-select
        v-model="selected_sort"
        :items="column_titles"
        item-text="title"
        item-value="name"
        hide-details
        outlined
        :placeholder="lang.views.radium.sort_works_by_placeholder[lg]"
        @change="sort_works()"
      />

      <CustomButton
        :text="$mobile_breakpoint ? lang.generic.save[lg] : ''"
        :icon="'mdi-content-save'"
        :dark="selected_sort ? true : false"
        :color="'blue'"
        class="ml-3"
        :disabled="!selected_sort"
        @click="send_work_sort()"
      />
    </div>

    <VueDraggable
      v-model="filtered_works"
      handle=".handle"
      :animation="100"
      easing="cubic-bezier(1, 0, 0, 1)"
      @change="selected_sort = 'custom_sort'"
      @start="is_moving = true"
      @end="is_moving = false"
      class="d-flex flex-column"
      :force-fallback="true"
      :scroll-sensitivity="100"
      :scroll-speed="30"
      :bubble-scroll="true"
    >
      <div
        v-for="work in filtered_works"
        :key="work.id"
        class="d-flex pa-1 my-1 lighten-4 rounded"
        :class="work.color"
        style="color: black;"
      >
        <v-icon class="cursor-move handle mx-3 pink--text">
          mdi-drag-horizontal-variant
        </v-icon>

        <div
          class="mx-6 d-flex flex-column align-self-center"
          style="width: 80px;"
        >
          <div v-for="shift in work.shifts" :key="shift.id">
            {{ $tool.format_date(shift.date) }}
          </div>
        </div>

        <div
          v-if="work.work_columns.find(c => c.name == 'description')"
          class="d-flex justify-center flex-grow-1 align-self-center text-center"
          style="white-space: pre-line;"
        >
          {{ work.work_columns.find(c => c.name == 'description').value }}
        </div>
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
    <Loader :size="100" :width="10" class="my-16" v-if="messages_loading" />

    <div v-else>
      <div v-if="messages.length == 0" class="d-flex justify-center pa-13">
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
          <div class="px-3" style="white-space: pre-line;">
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
            @click="pending_message = message; acquit_dialog = true;"
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
            @confirm="acquit_message()"
          ></CustomDialog>
        </div>
      </div>
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
      sort_dialog: false,
      team: Object(),
      app: Object(),
      config: Object(),
      works: Array(),
      column_configs: Array(),
      messages: Array(),
      messages_loading: true,
      messages_dialog: false,
      message_count: 0,
      acquit_dialog: false,
      palette: false,
      palette_color: 'red',
      palette_mode: 'works',
      active_filters: Array(),
      selected_sort: null,
      excluded_filters: [
        'shifts',
        'files',
        'limits',
        's460s',
      ],
      filtered_works: Array(),
      rerender_count: 0,
      config_is_updating: false,
      config_update_timer: null,
      is_moving: false,
      doc_width: 1980,
      moving_work_loading: false,
      copying_work_loading: false,
      edit_all: false,
      pending_message: null,
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
    this.column_configs = this.get_column_configs()
    this.message_count = this.request.message_count

    this.filtered_works = this.get_filtered_works()

    this.loading = false

    this.request = await this.$http.get('apps')
    this.circles = this.request.circles
      
    // Has to be here to avoid glitch on loading page
    this.doc_width = document.getElementById('main-frame').scrollWidth
    

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
    column_titles() {
      let column_titles = Array()

        column_titles.push({
          'title': this.lang.views.radium.original_order[this.lg],
          'name': 'original',
        })

      for (let column_config of this.column_configs.filter(c => c.visible)) {
        column_titles.push({
          'title': this.lang.views.radium['column_title_' + column_config.name][this.lg],
          'name': column_config.name,
        })
      }

      return column_titles
    },

    show_commands() {
      return (this.$store.state.moving_work && this.$store.state.moving_work.apps.includes(Number(this.$current_app_id))) || this.$store.state.copying_work
    },

    show_move_command() {
      return this.$store.state.moving_work && this.$store.state.moving_work.apps.includes(Number(this.$current_app_id))
    },

    show_copy_command() {
      return this.$store.state.copying_work
    },

    moving_disabled() {
      return !this.$store.state.moving_work || Number(this.$store.state.moving_work.date.split('-')[1]) == Number(this.$current_month)
    },
  },

  methods: {
    async add_work() {
      this.add_loading = true

      let request = await this.$http.post('works', {
        'action': 'create_work',
        'element_type': 'work',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'date': `${this.$current_year}-${this.$current_month}-01`
      })

      let work = request.work
      work.newly_created = true
      this.filtered_works.push(work)
      work.is_new = true

      setTimeout(() => {
        document.getElementById('main-frame').scrollTop = 999999999
      }, 100)

      // Might be removed
      this.update_work_position()

      this.add_loading = false
    },

    async update_work_position() {
      let position_updates = Array()
      let i = 0

      for (let work of this.filtered_works) {
        work.link.position = i
        i++

        position_updates.push({
          'element_id': work.id,
          'element_position': work.link.position,
        })
      }

      await this.$http.post('works', {
        'action': 'update_work_position',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'position_updates': position_updates,
      })
    },

    toggle_edit_all() {
      let works = this.$children.filter(
        w => w.$options._componentTag == 'Work')

      if (this.edit_all) {
        for (let work of works) {
          work.edit_mode = false
          work.update()
        }
      }

      else {
        for (let work of works) {
          work.edit_mode = true
        }
      }

      this.edit_all = !this.edit_all
    },

    get_column_configs() {
      let columns = this.config.columns.filter(
        c => !c.name.includes('printable_'))

      columns.sort((a, b) => a.position - b.position)

      return columns
    },

    update_columns() {
      let i = 0

      for (let column of this.column_configs) {
        column.position = i

        i++
      }

      this.update_config()
    },

    async update_config() {
      if (!this.config_is_updating) {
        clearInterval(this.config_update_timer)
      }

      this.config_update_timer = setTimeout(async () => {
        await this.$http.post('works', {
          'action': 'update_config',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'element_id': this.config.id,
          'value': this.column_configs,
        })
      }, 1000)
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

        else {
          let column = work.work_columns.find(c => c.name == key)

          if (column && column.value) {
            filters.push(column.value)
          }
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
              return w.work_columns.find(c => {
                return filter.filters.find(f => f == c.value)
              })
            })
          }
        }
      }

      works.sort((a, b) => a.link.position - b.link.position)

      return works
    },

    sort_works() {
      if (this.selected_sort == 'original') {
        this.filtered_works.sort((a, b) => {
          return a.link.position - b.link.position
        })
      }

      else if (this.selected_sort == 'shifts') {
        this.filtered_works.sort((a, b) => {
          let child_a = a.shifts[0]
          let child_b = b.shifts[0]

          if (child_a && child_b) {
            let aSize = new Date(child_a.date).getTime()
            let bSize = new Date(child_b.date).getTime()
            let aLow = child_a.shift
            let bLow = child_b.shift

            if (aSize == bSize) return (aLow < bLow) ? -1 : (aLow > bLow) ? 1 : 0
            else return (aSize < bSize) ? -1 : 1
          }

          else if (!child_a) {
            return 1
          }

          else if (!child_b) {
            return -1
          }
        })
      }
      
      else {
        this.filtered_works.sort((a, b) => {
          let child_a = a.work_columns.find(c => c.name == this.selected_sort)
          let child_b = b.work_columns.find(c => c.name == this.selected_sort)

          if (!child_a || !child_a.value) {
            return 1
          }

          else if (!child_b || !child_b.value) {
            return -1
          }

          else if (isNaN(child_a.value + child_b.value)) {
            return (child_a.value).localeCompare(child_b.value)
          }

          else {
            return child_a.value - child_b.value
          }
        })
      }
    },

    send_work_sort() {
      this.update_work_position()

      this.selected_sort = null
    },

    by_author_on_date(date, author) {
      let txt = this.lang.generic.by_author_on_date[this.lg]

      txt = txt.replace('@@@', this.$tool.format_date(date))
      txt = txt.replace('###', author)

      return txt
    },

    async acquit_message() {
      this.messages = this.messages.filter(m => m.id !== this.pending_message.id)
      this.message_count--
      this.acquit_dialog = false

      await this.$http.post('works', {
        'action': 'acquit_message',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': 'message',
        'element_id': this.pending_message.id,
      })

      this.pending_message = null
    },

    async open_message_dialog() {
      this.messages_loading = true
      this.messages_dialog = true

      let request = await this.$http.get('messages', {
        'app_id': this.$current_app_id,
      })

      this.messages = request.messages
      this.messages_loading = false
    },

    async move_work() {
      this.moving_work_loading = true
      let moving_work = this.$store.state.moving_work
      let new_date = this.$get_first_from_current_date()

      let request = await this.$http.post('works', {
        'action': 'move_work',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': moving_work.type,
        'element_id': moving_work.id,
        'date': new_date,
      })

      let work = request.work
      this.filtered_works.push(work)

      this.$store.commit('set_moving_work', null)
      this.moving_work_loading = false

      setTimeout(() => {
        document.getElementById('main-frame').scrollTop = 999999999
      }, 100)

      this.update_work_position()
    },

    async copy_work() {
      this.copying_work_loading = true
      let copying_work = this.$store.state.copying_work
      let new_date = this.$get_first_from_current_date()

      let request = await this.$http.post('works', {
        'action': 'copy_work',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': copying_work.type,
        'element_id': copying_work.id,
        'work': copying_work,
        'date': new_date,
      })

      let work = request.work
      this.filtered_works.push(work)

      this.$store.commit('set_copying_work', null)
      this.copying_work_loading = false

      setTimeout(() => {
        document.getElementById('main-frame').scrollTop = 999999999
      }, 100)

      this.update_work_position()
    },

    async clear_all_is_edited() {
      this.$http.post('works', {
        'action': 'clear_all_is_edited',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'month': this.$current_month,
        'year': this.$current_year,
      })

      let works = this.$children.filter(
        w => w.$options._componentTag == 'Work')

      for (let work of works) {
        for (let column_name in work.self.columns) {
          work.self.columns[column_name].is_edited = false
        }
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

.works-frame {
  display: flex;
  flex-direction: column;
}

.works-customize-row {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}

.works-customize-row:not(:last-child) {
  border-bottom: 1px grey solid;
}

.message-frame {
  margin-top: 9px;
  padding: 9px;
  border: 1px orange solid;
  border-radius: 5px;
}

.works-navigation {
  display: flex;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 2;
  padding-top: 10px;
  padding-bottom: 5px;
  background-color: white;
  z-index: 5;
}

.works-navigation-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  position: sticky;
  left: 0;
}

.works-navigation-scrolled {
  border-bottom: 1px black solid;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
}

.works-customize-scrollbar {
  width: 100%;
  overflow-x: scroll;
}

.works-customize-scrollbar::-webkit-scrollbar {
  display: none;
}

.works-command-buttons-position {
  position: absolute;
  bottom: 20px;
  right: 5px;
}

</style>
