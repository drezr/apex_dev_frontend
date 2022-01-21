<template>


<div
  class="work-overframe-printable"
>
  <div class="work-frame lighten-5" :class="self.color">
    <div
      v-for="(column_config, i) in column_configs"
      :key="i"
      class="work-column"
      :style="`min-width: ${Number(column_config.width) + (edit_mode && column_config.multiple && column_config.name != 'files' ? 70 : 0)}px; max-width: ${Number(column_config.width) + (edit_mode && column_config.multiple && column_config.name != 'files' ? 70 : 0)}px;`"
    >
      <div class="work-column-title">
        {{ lang.views.radium['column_title_' + column_config.name][lg] }}
      </div>



      <!-- ############## Column Subtitles ############## -->

      <div>
        <div
          v-if="['shifts', 'limits', 's460s'].includes(column_config.name)"
          class="d-flex lighten-4"
        >
          <div class="work-drag-spacer" v-if="edit_mode"></div>

          <div
            class="work-column-subtitle"
            v-for="(data, field) in table_configs[column_config.name]"
            :key="field"
            :style="`width: ${data.width}; max-width: ${data.width}%; overflow: hidden;`"
          >
            {{ data.name }}
          </div>

          <div class="work-delete-spacer" v-if="edit_mode"></div>
        </div>
      </div>







      <div
        class="work-column-value"
        :class="[
          edit_mode ? 'white' : self.columns[column_config.name].bg_color,
          !edit_mode && self.columns[column_config.name].value || self.columns[column_config.name].rows.length > 0 ? 'lighten-4' : 'lighten-2 accent-1',
          self.columns[column_config.name].clickable && !edit_mode ? 'work-column-value-clickable' : '',
          $current_component.palette && !edit_mode ? 'work-column-value-painter' : '',
        ]"
      >





        <!-- ############## Textarea ############## -->

        <div v-if="!column_config.multiple" style="width: 100%; display: flex; justify-content: center;">
          <textarea
            :ref="column_config.name"
            v-model="self.columns[column_config.name].value"
            :style="get_textarea_style(column_config.name)"
            style="width: calc(100% - 4px); overflow-x: hidden; padding: 0 5px;"
            class="work-textarea my-2 text--accent-4 hide-scrollbar"
            :class="self.columns[column_config.name].text_color ? self.columns[column_config.name].text_color + '--text' : ''"
            :disabled="!edit_mode"
          ></textarea>
        </div>




        <!-- ############## Shifts ############## -->

        <div
          v-else-if="column_config.name == 'shifts'"
          class="align-self-start"
          style="width: 100%;"
        >
          <div
            v-for="(shift, i) in self.shifts"
            :key="i"
            class="d-flex"
          >
            <div
              class="work-row-drag pink"
              v-if="edit_mode"
              :style="`cursor: ${grab_cursor};`"
              @mousedown="grab_cursor = 'grabbing'"
              @mouseup="grab_cursor = 'grab'"
              @mouseleave="grab_cursor = 'grab'"
            >
              <v-icon color="white" small>mdi-arrow-split-horizontal</v-icon>
            </div>

            <Shift
              :self="shift"
              :parent="self"
              :column="column_config"
              :edit_mode="edit_mode"
            />

            <div
              class="work-row-delete red"
              v-if="edit_mode"
            >
              <v-icon color="white">mdi-delete</v-icon>
            </div>
          </div>
        </div>




        <!-- ############## Multiple ############## -->

        <VueDraggable
          v-else
          v-model="self.columns[column_config.name].rows"
          @change="update_child_position(column_config.name)"
          :animation="100"
          easing="cubic-bezier(1, 0, 0, 1)"
          handle=".work-row-drag"
          style="width: 100%;"
          class="align-self-start"
        >
          <div
            v-for="(row, i) in self.columns[column_config.name].rows"
            :key="i"
            class="d-flex"
          >
            <div
              class="work-row-drag pink"
              v-if="edit_mode && column_config.multiple"
              :style="`cursor: ${grab_cursor};`"
              @mousedown="grab_cursor = 'grabbing'"
              @mouseup="grab_cursor = 'grab'"
              @mouseleave="grab_cursor = 'grab'"
            >
              <v-icon color="white" small>mdi-arrow-split-horizontal</v-icon>
            </div>





            <!-- ############## Limits ############## -->

            <WorkRow
              v-if="column_config.name == 'limits'"
              :self="row"
              :parent="self.columns[column_config.name]"
              :column_config="column_config"
              :parent_cpnt="$current_instance"
              :edit_mode="edit_mode"
              :config="limits_table_config"
              @update="update()"
            />




            <!-- ############## S460s ############## -->

            <WorkRow
              v-if="column_config.name == 's460s'"
              :self="row"
              :parent="self.columns[column_config.name]"
              :column_config="column_config"
              :parent_cpnt="$current_instance"
              :edit_mode="edit_mode"
              :config="s460s_table_config"
              @update="update()"
            />





            <div
              v-if="edit_mode && column_config.multiple"
              class="work-row-delete red"
              @click="open_remove_child_dialog(row, column_config.name)"
            >
              <v-icon color="white">mdi-delete</v-icon>
            </div>


          </div>
        </VueDraggable>
      </div>





      <div
        v-if="edit_mode && column_config.multiple"
        class="work-add-button"
        :class="add_loading ? 'work-add-button-disabled grey' : 'green'"
      >
        <v-icon color="white" v-if="!add_loading">mdi-plus</v-icon>
        <Loader :size="19" :width="3" :color="'white'" v-else />
      </div>



    </div>
  </div>

</div>

</template>


<script>

import Shift from '@/views/radium/components/Shift.vue'
import WorkRow from '@/views/radium/components/WorkRow.vue'

export default {
  name: 'WorkPrintable',

  components: {
    Shift,
    WorkRow,
  },

  props: {
    self: Object,
    parent_cpnt: Object,
  },

  data() {
    return {
      edit_mode: false,
      expanded: false,
      grab_cursor: 'grab',
      link_radiums_dialog: false,
      link_selected_radiums: Array(),
      log_dialog: false,
      log_dialog_loading: true,
      message_dialog: false,
      message: '',
      message_selected_radiums: Array(),
      message_preset: 0,
      remove_dialog: false,
      add_loading: false,
      remove_child_dialog: false,
      remove_child_column_name: null,
      remove_child_item: null,
      link_radiums_snackbar: false,
      link_radiums_timeout: 4000,
      original_self: null,
    }
  },

  created() {
    if (this.self.newly_created) {
      this.edit_mode = true
      this.expanded = true
      this.self.newly_created = false
    }

    this.self.shifts.sort((a, b) => a.position - b.position)
    this.self.work_columns.sort((a, b) => a.position - b.position)

    for (let column of this.self.work_columns) {
      column.rows.sort((a, b) => a.position - b.position)
    }

    let columns = this.get_columns()
    this.$set(this.self, 'columns', columns)
  },

  computed: {
    column_configs() {
      return this.$current_component.column_configs.filter(c => c.visible)
    },

    table_configs() {
      return {
        'shifts': this.shifts_table_config,
        'limits': this.limits_table_config,
        's460s': this.s460s_table_config,
      }
    },

    shifts_table_config() {
      return {
        'week': {
          'name' : this.lang.generic.week[this.lg],
          'width': '30%',
        },
        'day': {
          'name' : this.lang.generic.day[this.lg],
          'width': '30%',
        },
        'schedule': {
          'name' : this.lang.generic.schedule[this.lg],
          'width': '40%',
        },
      }
    },

    limits_table_config() {
      return {
        'from_line': {
          'name' : this.lang.views.radium.line[this.lg],
          'width': '6%',
        },
        'from_station': {
          'name' : this.lang.views.radium.station[this.lg],
          'width': '18%',
        },
        'from_lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '5%',
        },
        'from_signal': {
          'name' : this.lang.views.radium.signal[this.lg],
          'width': '13%',
        },
        'from_pk': {
          'name' : this.lang.views.radium.pk[this.lg],
          'width': '8%',
        },
        'to_line': {
          'name' : this.lang.views.radium.line[this.lg],
          'width': '6%',
        },
        'to_station': {
          'name' : this.lang.views.radium.station[this.lg],
          'width': '18%',
        },
        'to_lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '5%',
        },
        'to_signal': {
          'name' : this.lang.views.radium.signal[this.lg],
          'width': '13%',
        },
        'to_pk': {
          'name' : this.lang.views.radium.pk[this.lg],
          'width': '8%',
        },
      }
    },

    s460s_table_config() {
      return {
        'from_line': {
          'name' : this.lang.views.radium.line[this.lg],
          'width': '21%',
        },
        'from_lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '15%',
        },
        'from_pk': {
          'name' : this.lang.views.radium.from[this.lg],
          'width': '32%',
        },
        'to_pk': {
          'name' : this.lang.views.radium.to[this.lg],
          'width': '32%',
        },
      }
    },
  },

  methods: {
    get_columns() {
      let columns = Object()

      for (let column_config of this.$current_component.column_configs) {
        let column = this.self.work_columns.find(
          c => c.name == column_config.name)

        if (column) {
          columns[column_config.name] = column
        }

        else {
          columns[column_config.name] = {
            'name': column_config.name,
            'value': null,
            'bg_color': null,
            'text_color': null,
            'is_edited': false,
            'rows' : Array(),
          }
        }
      }

      return columns
    },

    get_textarea_style(column_name) {
      this.$nextTick(() => {
        if (this.$refs[column_name]) {
          let textarea = this.$refs[column_name][0]

          if (textarea) {
            let column_config = this.column_configs.find(c => c.name == column_name)
            textarea.style.fontSize = `${column_config.textsize}px`
            textarea.style.height = `5px`
            textarea.style.height = `${textarea.scrollHeight}px`
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

.work-overframe-printable {
  border: 1px black solid;
  width: min-content;
  position: relative;
  break-inside: avoid;
}

.work-frame {
  display: flex;
  flex-wrap: nowrap;
}

.work-column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.work-column:not(:first-child) {
  border-left: 1px grey solid;
}

.work-column-title {
  font-size: 14px;
  height: 20px;
  font-weight: bold;
  border-bottom: 1px grey solid;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.work-column-subtitle {
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px grey solid;
  position: relative;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
}

.work-column-subtitle:not(:last-child) {
  border-right: 1px grey solid;
}

.work-column-value {
  display: flex;
  align-items: center;
  flex-grow: 1;
  cursor: text;
  padding: 0px;
  position: relative;
}

.work-column-value-clickable:hover {
  filter: brightness(1.3);
  cursor: pointer;
}

.work-drag-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0px;
  left: 1px;
  width: 19px;
  height: 19px;
  border-radius: 10px;
}

.work-drag-button-disabled {
  pointer-events: none !important;
  filter: saturate(0%);
  opacity: 0.5;
}

.work-border-right {
  border-right: 1px grey solid;
}

.work-border-bottom {
  border-bottom: 1px grey solid;
}

.work-column-value-focused {
  box-shadow: inset 0px 0px 0px 2px orange;
  transition: box-shadow .2s;
}

.work-shifts {
  width: 100%;
  height: 100%;
}

.work-expand {
  border-top: 1px black solid;
}

.work-expand-button {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 50px;
  width: 50px;
  cursor: pointer;
}

.work-expand-button:hover {
  filter: brightness(1.3);
}

.work-link-expension-panel {
  border: 1px rgba(0, 0, 0, 0.3) solid;
  margin-top: 10px;
}

.work-log-button {
  cursor:  pointer;
  position: absolute;
  top: -4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.work-log-cell {
  white-space: pre;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.work-rows {
  width: 100%;
  height: 100%;
}

.work-row {
  display: flex;
}

.work-row-field {
  border-bottom: 1px grey solid;
  text-align: center;
  font-size: 12px;
}

.work-row-field:not(:last-child) {
  border-right: 1px grey solid;
}

.work-add-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  cursor: pointer;
  transition: filter .2s;
}

.work-add-button:hover {
  filter: brightness(1.1);
}

.work-add-button-disabled {
  cursor: default !important;
}

.work-add-button-disabled:hover {
  filter: brightness(1) !important;
}

.work-subcolumn:not(:last-child) {
  border-right: 1px grey solid;
}

.work-row-delete {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  max-width: 50px;
  min-width: 50px;
  width: 50px;
  margin-bottom: 1px;
  transition: filter .3s;
}

.work-row-delete:hover {
  filter: brightness(1.8);
}

.work-delete-spacer {
  max-width: 50px;
  min-width: 50px;
  width: 50px;
  height: 16px;
  border-bottom: 1px grey solid;
}

.work-row-drag {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 25px;
  min-width: 25px;
  width: 25px;
  margin-bottom: 1px;
  transition: filter .3s;
}

.work-row-drag:hover {
  filter: brightness(1.8);
}

.work-drag-spacer {
  max-width: 25px;
  min-width: 25px;
  width: 25px;
  height: 16px;
  border-bottom: 1px grey solid;
  border-right: 1px grey solid;
}

.work-textarea {
  resize: none;
  text-align: center;
  outline: none;
}

.work-textarea:disabled {
  color: black;
  cursor: text;
}

</style>
