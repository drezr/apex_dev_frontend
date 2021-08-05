<template>

<div class="pr-3" style="min-width: min-content;">
<div
  class="work-overframe"
  :class="[
    $current_component.palette ? 'work-cursor-fill' : '',
  ]"
  @click="set_color()"
>
  <div class="work-frame lighten-5" :class="self.color">
    <div
      class="work-expand-button"
      :class="self.color"
      @click="expanded = !expanded"
    >
      <v-icon>mdi-chevron-{{ expanded ? 'up' : 'down' }}</v-icon>
    </div>

    <div
      v-for="(column, i) in $parent.$parent.columns.filter(c => c.visible)"
      :key="i"
      class="work-column"
      :style="`min-width: ${column.width}px; max-width: ${column.width}px;`"
    >
      <div class="work-column-title">
        <div
          v-if="i == 0"
          class="work-drag-button pink"
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
          edit_mode ? 'white' : (self[column.name + '_bg_color'] ? self[column.name + '_bg_color'] : self.color),
          edit_mode ? '' : (self[column.name + '_bg_color'] ? 'lighten-2 accent-1' : (self[column.name] && self[column.name].length > 0 ? 'lighten-4' : 'lighten-3')),
          is_clickable(column.name) && !edit_mode ? 'work-column-value-clickable' : '',
          is_palette_active && !edit_mode ? 'work-column-value-painter' : '',
        ]"
        @mouseover="value_over($event)"
        @mouseleave="value_leave($event)"
        @click="value_click($event, column.name, self[column.name])"
        @blur.capture="value_blur($event)"
      >
        <v-textarea
          v-if="!Array.isArray(self[column.name]) && column.name in self"
          v-model="self[column.name]"
          :rows="1"
          auto-grow
          outlined
          hide-details
          class="work-field"
          :style="`font-size: ${column.textsize}px;`"
          :disabled="!edit_mode"
          :background-color="edit_mode ? 'white' : 'transparent'"
        />

        <CustomButton
          v-if="!Array.isArray(self[column.name]) && column.name in self"
          class="work-log-button"
          :icon="'mdi-clock-time-four-outline'"
          :small_fab="true"
          :tooltip="lang.generic.log[lg]"
          :style="`left: ${column.width - 32}px;`"
          @click="open_log_dialog(column.name)"
        />

        <div v-if="column.name == 'shifts'" class="work-shifts">
          <div v-if="self.shifts.length > 0">
            <div class="d-flex lighten-4" :class="self.color">
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

            <Shift
              v-for="(shift, i) in self.shifts"
              :key="i"
              :self="shift"
              :parent="self"
            />
          </div>
        </div>

        <div
          v-if="column.name == 'limits'"
          class="work-limits lighten-3"
          :class="self.color"
        >
          <div class="d-flex">
            <div class="work-limit-field" style="width: calc(50% - 1px);">
              <div :class="self.color" class="lighten-5">
                <b>{{ lang.views.radium.limit_from[lg] }}</b>
              </div>
            </div>
            <div class="work-limit-field" style="width: calc(50% + 1px);">
              <div :class="self.color" class="lighten-5">
                <b>{{ lang.views.radium.limit_to[lg] }}</b>
              </div>
            </div>
          </div>

          <div class="d-flex">
            <div
              v-for="(data, field) in limit_fields"
              :key="field"
              :style="`width: ${data.width};`"
              class="work-limit-field"
            >
              <div :class="self.color" class="lighten-5">
                <b>{{ data.name }}</b>
              </div>
            </div>
          </div>

          <div v-if="self.shifts.length > 0">
            <div
              v-for="(limit, i) in self.limits"
              :key="i"
            >
              <div class="work-limit">
                <div
                  v-for="(data, field) in limit_fields"
                  :key="field"
                  :style="`width: ${data.width};`"
                  class="work-limit-field"
                >
                  <v-text-field
                    v-model="limit[field]"
                    :disabled="!edit_mode"
                    hide-details
                    :background-color="edit_mode ? 'white' : self.color + ' lighten-4'"
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

  <div class="work-expand" v-if="expanded">
    <div class="lighten-5 pb-3" :class="self.color">
      <div class="pa-1">
        <CustomButton
          :text="edit_mode ? lang.generic.save[lg] : lang.generic.edit[lg]"
          :rounded="true"
          :color="edit_mode ? 'blue' : 'teal'"
          :dark="true"
          :icon="edit_mode ? 'mdi-content-save' : 'mdi-pencil'"
          @click="edit_mode = !edit_mode"
          :tooltip="edit_mode ? lang.views.radium.lock_tooltip[lg] : lang.views.radium.edit_tooltip[lg]"
          class="mr-3"
        />

        <CustomButton
          v-if="edit_mode"
          :text="lang.generic.delete[lg]"
          :rounded="true"
          :color="'red'"
          :dark="true"
          :icon="self.link.is_original ? 'mdi-delete' : 'mdi-link-variant-off'"
          :tooltip="lang.views.radium.delete_tooltip[lg]"
          class="mr-3"
          @click="remove_dialog = true"
        />

        <CustomButton
          :text="lang.generic.message[lg]"
          :rounded="true"
          :color="'deep-orange'"
          :dark="true"
          :icon="'mdi-android-messages'"
          :tooltip="lang.views.radium.message_tooltip[lg]"
          class="mr-3"
          @click="message_dialog = true"
        />

        <CustomButton
          :text="lang.generic.to_copy[lg]"
          :rounded="true"
          :color="'indigo'"
          :dark="true"
          :icon="'mdi-content-copy'"
          :tooltip="lang.views.radium.copy_tooltip[lg]"
          class="mr-3"
        />

        <CustomButton
          :text="lang.generic.move[lg]"
          :rounded="true"
          :color="'light-blue'"
          :dark="true"
          :icon="'mdi-flip-to-front'"
          :tooltip="lang.views.radium.move_tooltip[lg]"
          class="mr-3"
        />

        <CustomButton
          :text="lang.generic.to_link[lg]"
          :rounded="true"
          :color="'purple'"
          :dark="true"
          :icon="'mdi-link-variant-plus'"
          :tooltip="lang.views.radium.link_radiums_tooltip[lg]"
          class="mr-3"
          @click="link_radiums_dialog = true"
        />
      </div>

      <Table
        :parent="self"
        :parent_cpnt="$current_instance"
      />
    </div>
  </div>

  <CustomDialog
    :open="link_radiums_dialog"
    :width="500"
    :title_text="lang.views.radium.link_radiums_tooltip[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-link-variant-plus'"
    :confirm_text="lang.generic.to_link[lg]"
    :confirm_color="'purple'"
    @cancel="link_radiums_dialog = false"
    @confirm="link_radiums"
  >
    <Loader
      :size="100"
      :width="10"
      :mt="50"
      :mb="50"
      v-if="$current_component.circles_loading"
    />

    <div class="mt-3" v-else>
      <v-expansion-panels
        class="work-link-expension-panel"
        v-for="(circle, x) in $current_component.circles"
        :key="x"
      >
        <v-expansion-panel>
          <v-expansion-panel-header>
            <b>{{ circle.name }}</b>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <div
              v-for="(team, y) in circle.teams"
              :key="y"
            >
              <div
                v-for="(app, z) in team.apps.filter(a => a.app == 'radium')"
                :key="z"
              >
                <v-checkbox
                  :label="team.name + (app.name ? ' (' + app.name + ')': '')"
                  hide-details
                  @change="toggle_link_radium(app.id)"
                  :input-value="self.apps.find(id => id == app.id)"
                  :disabled="self.apps.find(id => id == app.id) ? true : false"
                ></v-checkbox>
              </div>
            </div>

            <div style="width: 100%; height: 20px;"></div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </CustomDialog>

  <CustomDialog
    :open="log_dialog"
    :width="1300"
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

  <CustomDialog
    :open="message_dialog"
    :width="600"
    :title_text="lang.views.radium.message_tooltip[lg]"
    :title_icon="'mdi-android-messages'"
    @cancel="message_dialog = false"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-send'"
    :confirm_text="lang.generic.send[lg]"
    :confirm_color="'deep-orange'"
    :confirm_disabled="message_selected_radiums.length == 0 || message.length == 0"
    @confirm="send_message"
  >
    <v-select
      :items="message_presets"
      v-model="message_preset"
      @input="add_to_message($event)"
      :label="lang.views.radium.message_presets[lg]"
      outlined
      class="mb-3 mt-3"
      dense
      hide-details
    ></v-select>

    <v-textarea
      v-model="message"
      outlined
      auto-grow
      hide-details
    />

    <div class="mt-6 black--text">
      <b>{{ lang.views.radium.message_to_linked_radiums[lg] }}</b>
    </div>

    <div
      v-for="(linked_radium, i) in linked_radiums"
      :key="i"
    >
      <v-checkbox
        :label="linked_radium.team_name + (linked_radium.app_name ? ' (' + linked_radium.app_name + ')': '')"
        :input-value="message_selected_radiums.find(i => i == linked_radium.app_id)"
        @change="toggle_message_radium(linked_radium.app_id)"
        hide-details
      />
    </div>
  </CustomDialog>

  <CustomDialog
    :open="remove_dialog"
    :width="500"
    :title_text="lang.generic.are_you_sure[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-delete'"
    :confirm_text="lang.generic.delete[lg]"
    :confirm_color="'red'"
    @cancel="remove_dialog = false"
    @confirm="remove"
  ></CustomDialog>
</div>
</div>

</template>


<script>

import Shift from '@/views/radium/components/Shift.vue'
import Table from '@/views/radium/components/Table.vue'

export default {
  name: 'Work',

  components: {
    Shift,
    Table,
  },

  props: {
    self: Object,
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
    }
  },

  created() {
    // console.log(this.self)
  },

  computed: {
    linked_radiums() {
      let radiums = Array()

      for (let circle of this.$current_component.circles) {
        for (let team of circle.teams) {
          for (let app of team.apps) {
            if (this.self.apps.includes(app.id)) {
              radiums.push({
                'team_id': team.id,
                'app_id': app.id,
                'team_name': team.name,
                'app_name': app.name,
              })
            }
          }
        }
      }

      radiums.sort((a, b) => a.team_name.localeCompare(b.team_name))

      return radiums
    },
    
    message_presets() {
      return [
        this.lang.views.radium.message_preset_work_added[this.lg],
        this.lang.views.radium.message_preset_date_updated[this.lg],
        this.lang.views.radium.message_preset_shift_updated[this.lg],
        this.lang.views.radium.message_preset_desc_updated[this.lg],
        this.lang.views.radium.message_preset_note_added[this.lg],
        this.lang.views.radium.message_preset_bnx_added[this.lg],
        this.lang.views.radium.message_preset_ilt_added[this.lg],
        this.lang.views.radium.message_preset_work_canceled[this.lg],
      ]
    },

    is_palette_active() {
      return false
    },

    limit_fields() {
      return {
        'from_line': {
          'name' : this.lang.views.radium.limit_line[this.lg],
          'width': '6%',
        },
        'from_station': {
          'name' : this.lang.views.radium.limit_station[this.lg],
          'width': '20%',
        },
        'from_lane': {
          'name' : this.lang.views.radium.limit_lane[this.lg],
          'width': '5%',
        },
        'from_signal': {
          'name' : this.lang.views.radium.limit_signal[this.lg],
          'width': '10%',
        },
        'from_pk': {
          'name' : this.lang.views.radium.limit_pk[this.lg],
          'width': '9%',
        },
        'to_line': {
          'name' : this.lang.views.radium.limit_line[this.lg],
          'width': '6%',
        },
        'to_station': {
          'name' : this.lang.views.radium.limit_station[this.lg],
          'width': '20%',
        },
        'to_lane': {
          'name' : this.lang.views.radium.limit_lane[this.lg],
          'width': '5%',
        },
        'to_signal': {
          'name' : this.lang.views.radium.limit_signal[this.lg],
          'width': '10%',
        },
        'to_pk': {
          'name' : this.lang.views.radium.limit_pk[this.lg],
          'width': '9%',
        },
      }
    }
  },

  methods: {
    is_clickable(column_name) {
      let clickables = ['colt', ]

      if (clickables.includes(column_name)) {
        return true
      }

      return false
    },

    value_click(event, column_name, value) {
      if (!this.edit_mode && this.is_clickable(column_name)) {
        if (column_name == 'colt') {
          window.open('https://colt-website.infrabel.be/coupure/' + value)
        }
      }

      if (this.edit_mode) {
        let content = event.target.closest('.work-column-value')
        let textarea = content.getElementsByTagName('textarea')[0]

        if (textarea) {
          content.classList.add('work-column-value-focused')
          textarea.focus()
        }
      }

      if (this.$current_component.palette_mode == 'columns') {
        this.set_color(column_name)
      }
    },

    value_blur(event) {
      let content = event.srcElement.closest('.work-column-value')
      content.classList.remove('work-column-value-focused')
    },

    value_over(event) {
      let content = event.target.closest('.work-column-value')
      let button = content.getElementsByClassName('work-log-button')[0]

      if (button) {
        button.style.opacity = 1
      }
    },

    value_leave(event) {
      let content = event.srcElement.closest('.work-column-value')
      let button = content.getElementsByClassName('work-log-button')[0]

      if (button) {
        button.style.opacity = 0
      }
    },

    remove() {
      this.remove_dialog = false
      this.$current_component.works = this.$current_component.works.filter(
        w => w.id !== this.self.id)
    },

    link_radiums() {

    },

    toggle_link_radium(app_id) {
      if (this.link_selected_radiums.includes(app_id)) {
        this.link_selected_radiums = this.link_selected_radiums.filter(
          id => id !== app_id)
      }

      else {
        this.link_selected_radiums.push(app_id)
      }
    },

    toggle_message_radium(app_id) {
      if (this.message_selected_radiums.includes(app_id)) {
        this.message_selected_radiums = this.message_selected_radiums.filter(
          id => id !== app_id)
      }

      else {
        this.message_selected_radiums.push(app_id)
      }
    },

    async open_log_dialog(field) {
      this.log_dialog = true
      this.log_dialog_loading = true

      this.request = await this.$http.get('logs', {
        'work_id': this.self.id,
        'field': field,
      })

      this.logs = this.request.logs
      this.log_dialog_loading = false
    },

    add_to_message(event) {
      this.message = this.message + event + '\n'
      this.$nextTick(() => this.message_preset = 0)
    },

    send_message() {
      this.message_dialog = false

      // message request

      this.message = ''
      this.message_selected_radiums = Array()
    },

    set_color(column) {
      let cc = this.$current_component

      if (cc.palette && cc.palette_mode == 'works') {
        this.self.color = cc.palette_color
      }

      else if (cc.palette && cc.palette_mode == 'columns') {
        this.self[column + '_bg_color'] = cc.palette_color
      }
    },
  },

  watch: {

  },
}

</script>


<style>

.work-field {
  margin: 2px !important;
}

.work-field textarea:disabled {
  color: black !important;
}

.work-field textarea {
  margin-top: 10px !important;
  margin-bottom: 5px !important;
  text-align: center;
}

.work-field .v-input__slot {
  min-height: 0px !important;
}

.work-field fieldset {
  border: none !important;
}

.work-limit .v-input__slot:before {
  border: 0px black solid !important;
  border-width: 0px !important;
}

.work-limit input:disabled {
  color: black !important;
}

.work-limit input {
  text-align: center;
}

</style>


<style scoped>

.work-overframe {
  border: 1px black solid;
  width: min-content;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
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
  font-weight: bold;
  text-align: center;
  border-bottom: 1px grey solid;
  position: relative;
}

.work-column-subtitle {
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px grey solid;
  position: relative;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.work-column-subtitle:not(:first-child) {
  border-left: 1px grey solid;
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
  top: 1px;
  left: 1px;
  width: 19px;
  height: 19px;
  border-radius: 10px;
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

.work-cursor-fill * {
  cursor: url('data:image/x-icon;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAR0dHAP///wAiIiIAMjIyABYWFgA9PT0AODg4AE9PTwBfX18AKioqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAKMAAAAAAAAAAAAAAAAAAAoiMAAAAAAAAAAAAAAAAAACIiYAAAAAAAAAAAAAYAAAIiIiMAAAAAAAAAAAADAAAiIiIiAAAAAAAAAAAAUFACIiIiIiQAAAAAAAAAADAKIiIiIiIgAAAAAAAAAAAGMiImIiIiEAAAAAAAAAAAUAIiApIiJgAAAAAAAAAAAApgIiAiIgAAAAAAAAAAAAAAAKIoIiAAAAAAAAAAAAAAAABwICIAAAAAAAAAAAAAAAAAAAAlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAIAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////35///58P//8eB///HAP//xgB//8QAP//AAD//wAB//8AA///gAf//8AP///wD////C////5v///+7////x///w=='), auto !important;
}

.work-limits {
  width: 100%;
  height: 100%;
}

.work-limit {
  display: flex;
}

.work-limit-field {
  border-bottom: 1px grey solid;
  text-align: center;
  font-size: 12px;
}

.work-limit-field:not(:last-child) {
  border-right: 1px grey solid;
}

</style>
