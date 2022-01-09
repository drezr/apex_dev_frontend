<template>

<v-badge
  overlap
  bordered
  left
  top
  color="purple"
  icon="mdi-link-variant"
  :value="$show_link_badge"
>
<div class="pr-3" style="min-width: min-content;">
<div
  class="work-overframe"
  :class="[$current_component.palette ? 'cursor-fill' : '', ]"
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
      v-for="(column_config, i) in column_configs"
      :key="i"
      class="work-column"
      :style="`min-width: ${Number(column_config.width) + (edit_mode && column_config.multiple && column_config.name != 'files' ? 70 : 0)}px; max-width: ${Number(column_config.width) + (edit_mode && column_config.multiple && column_config.name != 'files' ? 70 : 0)}px;`"
    >
      <div
        class="work-column-title"
        :class="!column_config.multiple ? 'cursor-pointer' : ''"
        @click="open_log_dialog(column_config.name)"
      >
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
        @click="value_click($event, column_config, self.columns[column_config.name])"
        @blur.capture="value_blur($event)"
        :class="[
          edit_mode ? 'white' : self.columns[column_config.name].bg_color,
          !edit_mode && self.columns[column_config.name].value || self.columns[column_config.name].rows.length > 0 ? 'lighten-4' : 'lighten-2 accent-1',
          self.columns[column_config.name].clickable && !edit_mode ? 'work-column-value-clickable' : '',
          $current_component.palette && !edit_mode ? 'work-column-value-painter' : '',
        ]"
      >





        <!-- ############## Textarea ############## -->

        <div v-if="!column_config.multiple" style="width: 100%;">
          <textarea
            v-model="self.columns[column_config.name].value"
            @input="set_textarea_height($event, column_config, 2)"
            :style="get_textarea_style(column_config, 2, self.columns[column_config.name].value)"
            style="width: 100%;"
            class="work-textarea my-2 text--accent-4"
            :class="self.columns[column_config.name].text_color ? self.columns[column_config.name].text_color + '--text' : ''"
            :disabled="!edit_mode"
          ></textarea>
        </div>





        <!-- ############## Files ############## -->

        <div
          v-else-if="column_config.name == 'files'"
          style="width: 100%; height: 100%;"
          class="align-self-start d-flex flex-column"
        >
          <div class="d-flex">
            <div
              class="work-column-subtitle"
              v-for="(data, subcolumn) in table_configs[column_config.name]"
              :key="subcolumn"
              :style="`width: ${data.width}; max-width: ${data.width}%; overflow: hidden;`"
            >
              {{ data.name }}
            </div>
          </div>

          <div class="d-flex flex-grow-1">
            <div
              class="work-subcolumn-content"
              v-for="(data, subcolumn) in table_configs[column_config.name]"
              :key="subcolumn"
              :style="`width: ${data.width}; max-width: ${data.width}%;`"
            >
              <div class="flex-grow-1 d-flex flex-column justify-center align-center">
                <div
                  v-for="(file, i) in self.files.filter(f => f.kind == subcolumn)"
                  :key="i"
                  class="pa-1 ma-1 rounded text-center"
                  style="background-color: rgba(0, 0, 0, 0.1);"
                >
                  <CustomButton
                    :icon="$tool.get_file_icon(file.extension)"
                    :tooltip="file.name + (file.extension ? '.' + file.extension: '')"
                    :small_padding="true"
                    @click="get_file(file)"
                  />

                  <div
                    v-if="edit_mode"
                    class="d-flex mt-2 justify-space-beetween"
                  >
                    <CustomButton
                      :icon="'mdi-refresh'"
                      :tooltip="lang.generic.replace[lg]"
                      :small_fab="true"
                      :color="'teal'"
                      :no_padding="true"
                      @click="file_replace = file; file_kind = subcolumn; $refs['file-input'].click();"
                    />

                    <CustomButton
                      :icon="'mdi-delete'"
                      :tooltip="lang.generic.delete[lg]"
                      :small_fab="true"
                      :color="'red'"
                      @click="open_remove_child_dialog(file, 'files')"
                      :no_padding="true"
                    />
                  </div>
                </div>
              </div>

              <div
                v-if="edit_mode"
                class="work-add-button align-self-end"
                :class="add_loading ? 'work-add-button-disabled grey' : 'green'"
                @click="file_kind = subcolumn; $refs['file-input'].click();"
              >
                <v-icon color="white" v-if="!add_loading">mdi-plus</v-icon>
                <Loader :size="19" :width="3" :color="'white'" v-else />
              </div>
            </div>
          </div>
        </div>





        <!-- ############## Shifts ############## -->

        <div
          v-else-if="column_config.name == 'shifts'"
          class="align-self-start"
          style="width: 100%;"
        >
          <VueDraggable
            v-model="self.shifts"
            @change="update_child_position('shifts')"
            :animation="100"
            easing="cubic-bezier(1, 0, 0, 1)"
            handle=".work-row-drag"
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
                @click="open_remove_child_dialog(shift, 'shifts')"
              >
                <v-icon color="white">mdi-delete</v-icon>
              </div>
            </div>
          </VueDraggable>
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
        v-if="edit_mode && column_config.multiple && column_config.name != 'files'"
        class="work-add-button"
        :class="add_loading ? 'work-add-button-disabled grey' : 'green'"
        @click="add_child(column_config.name)"
      >
        <v-icon color="white" v-if="!add_loading">mdi-plus</v-icon>
        <Loader :size="19" :width="3" :color="'white'" v-else />
      </div>

    </div>
  </div>




  <!-- ############## Expand ############## -->

  <div class="work-expand" v-if="expanded">
    <div class="lighten-5 d-flex" :class="self.color">
      <div class="pa-1" v-if="$is_editor" style="position: sticky; left: 15px;">
        <CustomButton
          :text="edit_mode ? lang.generic.save[lg] : lang.generic.edit[lg]"
          :rounded="true"
          :color="edit_mode ? 'blue' : 'teal'"
          :dark="true"
          :icon="edit_mode ? 'mdi-content-save' : 'mdi-pencil'"
          @click="toggle_edit_mode()"
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
          :dark="!($store.state.moving_work && $store.state.moving_work.id == self.id)"
          :disabled="$store.state.moving_work && $store.state.moving_work.id == self.id"
          :icon="'mdi-flip-to-front'"
          :tooltip="lang.views.radium.move_tooltip[lg]"
          class="mr-3"
          @click="set_moving_work()"
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
    </div>

    <div class="lighten-5 py-3" :class="self.color">
      <ShiftDetail
        :parent="self"
        :parent_cpnt="$current_instance"
      />
    </div>
  </div>
</div>
</div>





  <!-- ############## Dialogs ############## -->

  <CustomDialog
    :open="link_radiums_dialog"
    :width="500"
    :title_text="lang.views.radium.link_radiums_tooltip[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-link-variant-plus'"
    :confirm_text="lang.generic.to_link[lg]"
    :confirm_color="'purple'"
    :confirm_disabled="link_selected_radiums.length == 0"
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
        :value="$current_component.circles.length == 1 ? 0 : null"
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

  <div v-if="log_dialog">
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
  </div>

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
      :items="message_priorities"
      v-model="message_priority"
      item-text="name"
      item-value="value"
      :label="lang.views.radium.message_presets[lg]"
      outlined
      class="mb-3 mt-3"
      dense
      hide-details
    ></v-select>


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

  <CustomDialog
    :open="remove_child_dialog"
    :width="500"
    :title_text="lang.generic.are_you_sure[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-delete'"
    :confirm_text="lang.generic.delete[lg]"
    :confirm_color="'red'"
    @cancel="remove_child_dialog = false"
    @confirm="remove_child"
  ></CustomDialog>

  <v-snackbar
    v-model="link_radiums_snackbar"
    :timeout="link_radiums_timeout"
  >
    {{ lang.views.radium.link_radiums_snackbar[lg] }}
  </v-snackbar>

  <input type="file"
    class="d-none"
    ref="file-input"
    v-on:change="add_file($event)"
  />
</v-badge>

</template>


<script>

import Shift from '@/views/radium/components/Shift.vue'
import ShiftDetail from '@/views/radium/components/ShiftDetail.vue'
import WorkRow from '@/views/radium/components/WorkRow.vue'

export default {
  name: 'Work',

  components: {
    Shift,
    ShiftDetail,
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
      message_priority: 'important',
      remove_dialog: false,
      add_loading: false,
      remove_child_dialog: false,
      remove_child_column_name: null,
      remove_child_item: null,
      link_radiums_snackbar: false,
      link_radiums_timeout: 4000,
      original_self: null,
      file_kind: null,
      file_replace: null,
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

    this.original_self = this.$tool.deepcopy(this.self)
  },

  computed: {
    column_configs() {
      return this.$current_component.column_configs.filter(c => c.visible)
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

    message_priorities() {
      return [
        {'value': 'important', 'name': this.lang.generic.important[this.lg]},
        {'value': 'notice', 'name': this.lang.generic.notice[this.lg]},
      ]
    },

    linked_radiums() {
      let radiums = Array()

      for (let circle of this.$current_component.circles) {
        for (let team of circle.teams) {
          for (let app of team.apps) {
            if (this.self.apps.includes(app.id)) {
              radiums.push({
                'team_id': team.id,
                'team_name': team.name,
                'app_id': app.id,
                'app_name': app.name,
              })
            }
          }
        }
      }

      radiums.sort((a, b) => a.team_name.localeCompare(b.team_name))

      return radiums
    },

    table_configs() {
      return {
        'shifts': this.shifts_table_config,
        'limits': this.limits_table_config,
        's460s': this.s460s_table_config,
        'files': this.files_table_config,
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

    files_table_config() {
      return {
        'ilt': {
          'name' : this.lang.views.radium.column_title_ilts[this.lg],
          'width': '25%',
        },
        'bnx': {
          'name' : this.lang.views.radium.column_title_bnxs[this.lg],
          'width': '25%',
        },
        'fmht': {
          'name' : this.lang.views.radium.column_title_fmhts[this.lg],
          'width': '25%',
        },
        'other': {
          'name' : this.lang.views.radium.column_title_others[this.lg],
          'width': '25%',
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

    set_textarea_height(event, column, extra_height) {
      event.target.style.height = `${Number(column.textsize) + ((extra_height * 2))}px `
      event.target.style.height = `${event.target.scrollHeight}px `
    },

    get_textarea_style(column, extra_height, value) {
      let line_count = value ? value.split(/\r\n|\r|\n/).length : 1

      return `font-size: ${column.textsize}px;
              height: ${Number(column.textsize * (line_count)) + (extra_height * 2) + 1}px;
              padding-top: ${extra_height}px;
              padding-bottom: ${extra_height}px; `
    },

    value_click(event, column_config, column) {
      if (!this.edit_mode && column_config.clickable && column.value) {
          window.open(column_config.path + column.value)
      }

      if (this.edit_mode) {
        let content = event.target.closest('.work-column-value')

        if (content) {
          let textarea = content.getElementsByTagName('textarea')[0]
          let no_focus = content.getElementsByClassName('no-focus')

          if (textarea && no_focus.length == 0) {
            content.classList.add('work-column-value-focused')
            textarea.focus()
          }
        }
      }

      if (['columns_bg', 'columns_text'].includes(this.$current_component.palette_mode)) {
        this.set_color(column)
      }
    },

    value_blur(event) {
      let content = event.srcElement.closest('.work-column-value')
      content.classList.remove('work-column-value-focused')
    },

    async set_color(column) {
      let cc = this.$current_component

      if (cc.palette && cc.palette_mode == 'works') {
        this.self.color = cc.palette_color
        this.update()
      }

      else if (column && cc.palette && cc.palette_mode == 'columns_bg') {
        column.bg_color = cc.palette_color
        this.update()
      }

      else if (column && cc.palette && cc.palette_mode == 'columns_text') {
        column.text_color = cc.palette_color
        this.update()
      }
    },

    toggle_edit_mode() {
      if (this.edit_mode) {
        this.edit_mode = false

        this.update()
      }

      else {
        this.edit_mode = true
      }
    },

    add_to_message(event) {
      this.message = this.message + event + '\n'
      this.$nextTick(() => this.message_preset = 0)
    },

    open_remove_child_dialog(child, type) {
      this.remove_child_column_name = type
      this.remove_child_item = child
      this.remove_child_dialog = true
    },

    async open_log_dialog(column_name) {
      if (this.self.columns[column_name].rows.length == 0 && !this.$current_component.palette && column_name != 'shifts') {
        this.log_dialog = true
        this.log_dialog_loading = true

        this.request = await this.$http.get('logs', {
          'work_id': this.self.id,
          'field': column_name,
        })

        this.logs = this.request.logs
        this.log_dialog_loading = false
      }
    },

    get_file(file) {
      window.open(`${this.$http.media}${file.uid}/${file.name}${file.extension ? '.' + file.extension : ''}`)
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

    set_moving_work() {
      this.$store.commit('set_moving_work', this.self)
    },










    // CRUD Methods




    async update() {
      let columns = Array()
      let logs = Array()

      for (let column_name in this.self.columns) {
        let original_column = this.original_self.columns[column_name]
        let new_column = this.self.columns[column_name]

        let column_is_updated = false
        let row_is_updated = false

        let is_same_value = original_column.value == new_column.value
        let is_same_bg_color = original_column.bg_color == new_column.bg_color
        let is_same_text_color = original_column.text_color == new_column.text_color

        if (!is_same_value) {
          logs.push({
            'column_name': column_name,
            'new_value': new_column.value,
            'old_value': original_column.value,
          })
        }

        if (!is_same_value || !is_same_bg_color || !is_same_text_color) {
          columns.push(new_column)
          column_is_updated = true
        }


        if (!column_is_updated && new_column.rows.length > 0) {
          for (let index in new_column.rows) {
            if (row_is_updated) break

            let orignal_row = original_column.rows[index]
            let new_row = new_column.rows[index]

            for (let field in new_row) {
              let is_same_field = new_row[field] == orignal_row[field]

              if (!is_same_field) {
                columns.push(new_column)
                row_is_updated = true
                break
              }
            }
          }
        }
      }
      
      let request = await this.$http.post('works', {
        'action': 'update_work',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': 'work',
        'element_id': this.self.id,
        'value': {
          'color': this.self.color,
          'columns': columns,
          'logs': logs,
        },
      })

      for (let column of request.columns) {
        for (let attr in column) {
          if (attr != 'rows') {
            this.self.columns[column.name][attr] = column[attr]
          }
        }

        // column.rows might not be reactive anymore
      }

      this.original_self = this.$tool.deepcopy(this.self)
    },

    async remove() {
      this.remove_dialog = false

      this.$current_component.filtered_works = this.$current_component.filtered_works.filter(w => w.id !== this.self.id)

      await this.$http.post('works', {
        'action': 'delete_work',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': 'work',
        'element_id': this.self.id,
      })

      this.parent_cpnt.update_work_position()
    },

    async add_child(column_name) {
      this.add_loading = true

      let request = await this.$http.post('works', {
        'action': 'create_child',
        'element_type': column_name,
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_id': this.self.id,
        'parent_type': 'work',
      })

      if (!this.self.columns[column_name].id) {
        for (let attr in request.column) {
          if (attr != 'rows') {
            this.self.columns[column_name][attr] = request.column[attr]
          }
        }
      }

      if (column_name == 'shifts') {
        this.self.shifts.push(request.child)
      }

      else {
        this.self.columns[column_name].rows.push(request.child)
        this.original_self.columns[column_name].rows.push(request.child)
      }

      this.add_loading = false
    },

    async add_file(e) {
      this.add_loading = true

      if (this.file_replace) {
        this.remove_child_column_name = 'files'
        this.remove_child_item = this.file_replace

        await this.remove_child()
        this.file_replace = null
      }

      this.$tool.get_file_data(e, async (data) => {
        data.append('action', 'add_file')
        data.append('element_type', 'file')
        data.append('kind', this.file_kind)
        data.append('view', this.$current_view)
        data.append('team_id', this.$current_team_id)
        data.append('app_id', this.$current_app_id)
        data.append('parent_type', 'work')
        data.append('parent_id', this.self.id)

        let request = await this.$http.post('works', data)

        this.add_loading = false
        this.file_kind = null

        this.self.files.push(request['file'])
      })
    },

    async update_child_position(column_name) {
      let position_updates = Array()
      let i = 0
      let list

      if (column_name == 'shifts') list = this.self.shifts
      else list = this.self.columns[column_name].rows

      for (let child of list) {
        child.position = i
        i++

        position_updates.push({
          'element_id': child.id,
          'element_type': child.type,
          'element_position': child.position,
          'column_name': column_name,
        })
      }

      await this.$http.post('works', {
        'action': 'update_child_position',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': this.self.type,
        'element_id': this.self.id,
        'position_updates': position_updates,
      })

      this.original_self = this.$tool.deepcopy(this.self)
    },

    async remove_child() {
      let column_name = this.remove_child_column_name

      if (column_name == 'shifts') {
        this.self.shifts = this.self.shifts.filter(s => this.remove_child_item.id != s.id)
      }

      else if (column_name == 'files') {
        this.self.files = this.self.files.filter(s => this.remove_child_item.id != s.id)
      }

      else {
        let rows = this.self.columns[column_name].rows.filter(
          f => f.id != this.remove_child_item.id)
        this.self.columns[column_name].rows = rows
      }

      this.remove_child_dialog = false

      await this.$http.post('works', {
        'action': 'delete_child',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_id': this.self.id,
        'parent_type': 'work',
        'element_type': this.remove_child_item.type,
        'element_id': this.remove_child_item.id,
        'value': {'column_name': column_name},
      })

      this.update_child_position(column_name)
    },

    async send_message() {
      this.message_dialog = false

      await this.$http.post('works', {
        'action': 'send_message',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': this.self.type,
        'element_id': this.self.id,
        'value': this.message,
        'app_ids': this.message_selected_radiums,
        'priority': this.message_priority,
      })

      if (this.message_selected_radiums.find(m => m == this.$current_app_id)) {
        this.$current_component.message_count++
      }

      // check if this app in message_selected_radiums to update message count

      this.message = ''
      this.message_selected_radiums = Array()
    },

    async link_radiums() {
      await this.$http.post('works', {
        'action': 'link_radiums',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': this.self.type,
        'element_id': this.self.id,
        'value': this.link_selected_radiums,
      })

      for (let app_id of this.link_selected_radiums) {
        this.self.apps.push(app_id)
      }

      this.link_selected_radiums = Array()
      this.link_radiums_dialog = false
      this.link_radiums_snackbar = true
    },
  },

  watch: {

  },
}

</script>


<style>

.work-overframe {
  border: 1px black solid;
  width: min-content;
  position: relative;
  border-radius: 4px;
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

.work-subcolumn-content {
  font-size: 12px;
  font-weight: bold;
  position: relative;
  height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100%;
}

.work-subcolumn-content:not(:last-child) {
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
