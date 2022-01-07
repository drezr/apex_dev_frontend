<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" class="works-printable-area">
      <div class="d-flex justify-start align-center my-1 mx-3 text-h5">
        <CustomButton
          :icon="'mdi-chevron-left'"
          :height="40"
          :outlined="true"
          class="mr-3 no-print"
          @click="$router.push(`/team/${$current_team_id}/radium/${$current_app_id}/works/month/${$current_month}/year/${$current_year}`)"
        />

        {{ team.name }}
        {{ app.name ? `(${app.name})` : '' }} -
        {{ lang.views.radium.printable_works[lg] }}
        {{ $tool.format_date_month_name_year(`${$current_year}-${$current_month}`, lg) }}

        <CustomButton
          :icon="'mdi-filter'"
          :height="40"
          :outlined="true"
          class="ml-3 no-print"
          :tooltip="lang.views.radium.filter_works_tooltip[lg]"
          @click="filter_dialog = true"
        />

        <CustomButton
          :icon="'mdi-tune-vertical'"
          :height="40"
          :outlined="true"
          class="ml-3 no-print"
          :tooltip="lang.views.radium.customize_tooltip[lg]"
          @click="customize_dialog = true"
        />

        <CustomButton
          :icon="'mdi-printer'"
          :height="40"
          :outlined="true"
          class="ml-3 no-print"
          @click="print_document"
        />
      </div>

      <div class="works-frame" v-if="filtered_works.length > 0">
        <WorkPrintable
          v-for="work in filtered_works"
          :key="work.id"
          :self="work"
          :parent_cpnt="$current_instance"
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
    >
      <div
        v-for="(column, i) in column_configs"
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
          @input="update_config()"
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
</div>

</template>


<script>

import WorkPrintable from '@/views/radium/components/WorkPrintable.vue'

export default {
  name: 'WorksPrintable',

  components: {
    WorkPrintable,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      config: Object(),
      works: Array(),
      column_configs: Array(),
      customize_dialog: false,
      filter_dialog: false,
      active_filters: Array(),
      excluded_filters: [
        'shifts',
        'files',
        'limits',
        's460s',
      ],
      filtered_works: Array(),
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

    this.filtered_works = this.get_filtered_works()

    this.loading = false
  },

  computed: {

  },

  methods: {
    get_column_configs() {
      let columns = this.config.columns.filter(
        c => c.name.includes('printable_'))
      
      columns.sort((a, b) => a.position - b.position)

      for (let column of columns) {
        column['name'] = column['name'].replace('printable_', '')
      }

      return columns
    },

    update_columns() {
      let i = 0

      for (let column of this.columns) {
        column.position = i

        i++
      }

      this.update_config()
    },

    async update_config() {
      if (!this.config_is_updating) {
        clearInterval(this.config_update_timer)
      }

      let true_name_columns = this.$tool.deepcopy(this.column_configs)

      for (let column of true_name_columns) {
        column.name = 'printable_' + column.name
      }

      this.config_update_timer = setTimeout(async () => {
        await this.$http.post('works', {
          'action': 'update_config',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'element_id': this.config.id,
          'value': true_name_columns,
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

    print_document() {
      print()
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

@media print {
  .works-printable-area {
    background-color: white;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 15px;
    font-size: 14px;
    line-height: 18px;
  }
}

</style>
