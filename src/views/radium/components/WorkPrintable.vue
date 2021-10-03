<template>

<div style="min-width: min-content;">
<div
  class="work-overframe"
>
  <div class="work-frame lighten-5" :class="self.color">
    <div
      v-for="(column, i) in $parent.$parent.columns.filter(c => c.visible && c.name != 'files')"
      :key="i"
      class="work-column"
      :style="`min-width: ${Number(column.width) + (edit_mode && ['shifts', 'limits', 's460s'].includes(column.name) ? 70 : 0)}px; max-width: ${Number(column.width) + (edit_mode && ['shifts', 'limits', 's460s'].includes(column.name) ? 70 : 0)}px;`"
    >
      <div class="work-column-title">
        <div
          v-if="i == 0"
          class="work-drag-button pink no-print"
          :style="`cursor: ${grab_cursor};`"
          @mousedown="grab_cursor = 'grabbing'"
          @mouseup="grab_cursor = 'grab'"
          @mouseleave="grab_cursor = 'grab'"
        >
          <v-icon size="16" color="white">mdi-arrow-split-horizontal</v-icon>
        </div>

        {{ lang.views.radium['column_title_' + column.name][lg] }}
      </div>

      <div
        class="work-column-value"
        :class="[
          edit_mode ? 'white' : (get_column_color(column.name)),
          edit_mode ? '' : (self[column.name + '_bg_color'] ? 'lighten-2 accent-1' : (self[column.name] && self[column.name].length > 0 ? 'lighten-4' : 'lighten-3')),
        ]"
      >



        <!-- ############## Textarea ############## -->




        <div
          v-if="!Array.isArray(self[column.name]) && column.name in self"
          class="work-field"
          :style="`font-size: ${column.textsize}px;`"
        >
          {{ self[column.name] }}
        </div>




        <!-- ############## Shifts ############## -->




        <div
          v-if="column.name == 'shifts'"
          class="work-shifts lighten-3"
          :class="get_column_color(column.name)"
        >
          <div v-if="self.shifts.length > 0">
            <div class="d-flex lighten-4" :class="get_column_color(column.name)">
              <div class="work-column-subtitle" style="width: 30%;">
                {{ lang.generic.week[lg] }}
              </div>

              <div class="work-column-subtitle" style="width: 30%;">
                {{ lang.generic.day[lg] }}
              </div>

              <div class="work-column-subtitle" style="width: 40%;">
                {{ lang.generic.schedule[lg] }}
              </div>
            </div>


            <div
              v-for="(shift, i) in self.shifts"
              :key="i"
              class="d-flex"
            >
              <Shift
                :self="shift"
                :parent="self"
                :column="column"
                :edit_mode="edit_mode"
                class="flex-grow-1"
              />
            </div>
          </div>
        </div>




        <!-- ############## Limits ############## -->




        <div
          v-if="column.name == 'limits'"
          class="work-rows lighten-3"
          :class="get_column_color(column.name)"
        >
          <div class="d-flex lighten-4" :class="get_column_color(column.name)">
            <div class="work-column-subtitle" style="width: calc(50% - 1px);">
              {{ lang.views.radium.from[lg] }}
            </div>

            <div class="work-column-subtitle" style="width: calc(50% + 1px);">
              {{ lang.views.radium.to[lg] }}
            </div>

         </div>

          <div class="d-flex lighten-4" :class="get_column_color(column.name)">
            <div
              class="work-column-subtitle"
              v-for="(data, field) in limit_fields"
              :key="field"
              :style="`width: ${data.width};`"
            >
              {{ data.name }}
            </div>
          </div>

          <div v-if="self.limits.length > 0">
            <div
              v-for="(limit, i) in self.limits"
              :key="i"
            >
              <div class="work-row">
                <div
                  v-for="(data, field) in limit_fields"
                  :key="field"
                  :style="`width: ${data.width};`"
                  class="work-row-field"
                >                  
                  <v-text-field
                    v-model="limit[field]"
                    :disabled="!edit_mode"
                    hide-details
                    :background-color="edit_mode ? 'white' : (get_column_color(column.name)) + ' lighten-4'"
                    :style="`font-size: ${column.textsize}px;`"
                    class="pa-0 ma-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>




        <!-- ############## S460s ############## -->




        <div
          v-if="column.name == 's460s'"
          class="work-rows lighten-3"
          :class="get_column_color(column.name)"
        >
          <div class="d-flex lighten-4" :class="get_column_color(column.name)">
            <div
              class="work-column-subtitle"
              v-for="(data, field) in s460_fields"
              :key="field"
              :style="`width: ${data.width};`"
            >
              {{ data.name }}
            </div>
          </div>

          <div v-if="self.s460s.length > 0">

            <div
              v-for="(s460, i) in self.s460s"
              :key="i"
            >
              <div class="work-row">
                <div
                  v-for="(data, field) in s460_fields"
                  :key="field"
                  :style="`width: ${data.width};`"
                  class="work-row-field"
                >
                  <v-text-field
                    v-model="s460[field]"
                    :disabled="!edit_mode"
                    hide-details
                    :background-color="edit_mode ? 'white' : (get_column_color(column.name)) + ' lighten-4'"
                    :style="`font-size: ${column.textsize}px;`"
                    class="pa-0 ma-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</div>

</template>


<script>

import Shift from '@/views/radium/components/Shift.vue'

export default {
  name: 'Work',

  components: {
    Shift,
  },

  props: {
    self: Object,
  },

  data() {
    return {
      edit_mode: false,
      grab_cursor: 'grab',
    }
  },

  created() {

  },

  computed: {
    file_fields() {
      return {
        'ilt': {
          'name' : this.lang.views.radium.column_title_ilts[this.lg],
          'width': '33%',
        },
        'bnx': {
          'name' : this.lang.views.radium.column_title_bnxs[this.lg],
          'width': '33%',
        },
        'fmht': {
          'name' : this.lang.views.radium.column_title_fmhts[this.lg],
          'width': '34%',
        },
      }
    },

    limit_fields() {
      return {
        'from_line': {
          'name' : this.lang.views.radium.line[this.lg],
          'width': '6%',
        },
        'from_station': {
          'name' : this.lang.views.radium.station[this.lg],
          'width': '20%',
        },
        'from_lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '5%',
        },
        'from_signal': {
          'name' : this.lang.views.radium.signal[this.lg],
          'width': '10%',
        },
        'from_pk': {
          'name' : this.lang.views.radium.pk[this.lg],
          'width': '9%',
        },
        'to_line': {
          'name' : this.lang.views.radium.line[this.lg],
          'width': '6%',
        },
        'to_station': {
          'name' : this.lang.views.radium.station[this.lg],
          'width': '20%',
        },
        'to_lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '5%',
        },
        'to_signal': {
          'name' : this.lang.views.radium.signal[this.lg],
          'width': '10%',
        },
        'to_pk': {
          'name' : this.lang.views.radium.pk[this.lg],
          'width': '9%',
        },
      }
    },

    s460_fields() {
      return {
        'line': {
          'name' : this.lang.views.radium.line[this.lg],
          'width': '21%',
        },
        'lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '15%',
        },
        'start': {
          'name' : this.lang.views.radium.from[this.lg],
          'width': '32%',
        },
        'end': {
          'name' : this.lang.views.radium.to[this.lg],
          'width': '32%',
        },
      }
    },
  },

  methods: {
    get_column_color(column_name) {
      return this.self[column_name + '_bg_color'] ? this.self[column_name + '_bg_color'] : this.self.color
    },
  },

  watch: {

  },
}

</script>


<style>

.work-field {
  margin: 2px !important;
  width: 100%;
  text-align: center;
}

.work-row .v-input__slot:before {
  border: 0px black solid !important;
  border-width: 0px !important;
}

.work-row input:disabled {
  color: black !important;
}

.work-row input {
  text-align: center;
}

</style>


<style scoped>

.work-overframe {
  border: 1px black solid;
  width: min-content;
  overflow: hidden;
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

.work-subcolumn:not(:last-child) {
  border-right: 1px grey solid;
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

</style>
