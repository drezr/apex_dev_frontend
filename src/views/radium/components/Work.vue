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
  :class="[
    $current_component.palette ? 'cursor-fill' : '',
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
      :style="`min-width: ${Number(column.width) + (edit_mode && ['shifts', 'limits', 's460s'].includes(column.name) ? 70 : 0)}px; max-width: ${Number(column.width) + (edit_mode && ['shifts', 'limits', 's460s'].includes(column.name) ? 70 : 0)}px;`"
    >
      <div class="work-column-title">
        <div
          v-if="i == 0 && $is_editor"
          class="work-drag-button pink"
          :class="$current_component.active_filters.length > 0 ? 'work-drag-button-disabled' : ''"
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
          is_clickable(column.name) && !edit_mode ? 'work-column-value-clickable' : '',
          is_palette_active && !edit_mode ? 'work-column-value-painter' : '',
        ]"
        @mouseover="value_over($event)"
        @mouseleave="value_leave($event)"
        @click="value_click($event, column.name, self[column.name])"
        @blur.capture="value_blur($event)"
      >




        <!-- ############## Textarea ############## -->




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
          @click.native.stop.prevent="open_log_dialog(column.name)"
        />




        <!-- ############## Shifts ############## -->




        <div
          v-if="column.name == 'shifts'"
          class="work-shifts lighten-3"
          :class="get_column_color(column.name)"
        >
          <div v-if="self.shifts.length > 0">
            <div class="d-flex lighten-4" :class="get_column_color(column.name)">
              <div class="work-drag-spacer" v-if="edit_mode"></div>

              <div class="work-column-subtitle" style="width: 30%;">
                {{ lang.generic.week[lg] }}
              </div>

              <div class="work-column-subtitle" style="width: 30%;">
                {{ lang.generic.day[lg] }}
              </div>

              <div class="work-column-subtitle" style="width: 40%;">
                {{ lang.generic.schedule[lg] }}
              </div>

              <div class="work-delete-spacer" v-if="edit_mode"></div>
            </div>

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
                  :column="column"
                  :edit_mode="edit_mode"
                  class="flex-grow-1"
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

          <div
            v-if="edit_mode"
            class="work-add-button"
            :class="add_shift_loading ? 'work-add-button-disabled grey' : 'green'"
            @click="add_shift"
          >
            <v-icon color="white" v-if="!add_shift_loading">mdi-plus</v-icon>
            <Loader :size="19" :width="3" :color="'white'" v-else />
          </div>
        </div>




        <!-- ############## Limits ############## -->




        <div
          v-if="column.name == 'limits'"
          class="work-rows lighten-3"
          :class="get_column_color(column.name)"
        >
          <div class="d-flex lighten-4" :class="get_column_color(column.name)">
            <div class="work-drag-spacer" v-if="edit_mode"></div>

            <div class="work-column-subtitle" style="width: calc(50% - 1px);">
              {{ lang.views.radium.from[lg] }}
            </div>

            <div class="work-column-subtitle" style="width: calc(50% + 1px);">
              {{ lang.views.radium.to[lg] }}
            </div>

            <div class="work-delete-spacer" v-if="edit_mode"></div>
          </div>

          <div class="d-flex lighten-4" :class="get_column_color(column.name)">
            <div class="work-drag-spacer" v-if="edit_mode"></div>

            <div
              class="work-column-subtitle"
              v-for="(data, field) in limit_fields"
              :key="field"
              :style="`width: ${data.width};`"
            >
              {{ data.name }}
            </div>

            <div class="work-delete-spacer" v-if="edit_mode"></div>
          </div>

          <div v-if="self.limits.length > 0">
            <VueDraggable
              v-model="self.limits"
              @change="update_child_position('limits')"
              :animation="100"
              easing="cubic-bezier(1, 0, 0, 1)"
              handle=".work-row-drag"
            >
              <div
                v-for="(limit, i) in self.limits"
                :key="i"
              >
                <div
                  class="work-row"
                  :class="edit_mode ? 'transparent' : (get_column_color(column.name)) + ' lighten-4'"
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

                  <div
                    v-for="(data, field) in limit_fields"
                    :key="field"
                    :style="`width: ${data.width};`"
                    class="work-row-field d-flex align-center"
                  >                  
                    <v-textarea
                      v-model="limit[field]"
                      :rows="1"
                      auto-grow
                      hide-details
                      class="work-field work-field-small no-focus pa-0 ma-0"
                      :style="`font-size: ${column.textsize}px;`"
                      :disabled="!edit_mode"
                      :background-color="edit_mode ? 'white' : (get_column_color(column.name)) + ' lighten-4'"
                    />
                  </div>

                  <div
                    class="work-row-delete red"
                    v-if="edit_mode"
                    @click="open_remove_child_dialog(limit, 'limits')"
                  >
                    <v-icon color="white">mdi-delete</v-icon>
                  </div>
                </div>
              </div>
            </VueDraggable>
          </div>

          <div
            v-if="edit_mode"
            class="work-add-button"
            :class="add_limit_loading ? 'work-add-button-disabled grey' : 'green'"
            @click="add_limit"
          >
            <v-icon color="white" v-if="!add_limit_loading">mdi-plus</v-icon>
            <Loader :size="19" :width="3" :color="'white'" v-else />
          </div>
        </div>




        <!-- ############## S460s ############## -->




        <div
          v-if="column.name == 's460s'"
          class="work-rows lighten-3"
          :class="get_column_color(column.name)"
        >
          <div class="d-flex lighten-4" :class="get_column_color(column.name)">
            <div class="work-drag-spacer" v-if="edit_mode"></div>

            <div
              class="work-column-subtitle"
              v-for="(data, field) in s460_fields"
              :key="field"
              :style="`width: ${data.width};`"
            >
              {{ data.name }}
            </div>

            <div class="work-delete-spacer" v-if="edit_mode"></div>
          </div>

          <div v-if="self.s460s.length > 0">
            <VueDraggable
              v-model="self.s460s"
              @change="update_child_position('s460s')"
              :animation="100"
              easing="cubic-bezier(1, 0, 0, 1)"
              handle=".work-row-drag"
            >
              <div
                v-for="(s460, i) in self.s460s"
                :key="i"
              >
                <div
                  class="work-row"
                  :class="edit_mode ? 'transparent' : (get_column_color(column.name)) + ' lighten-4'"
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

                  <div
                    v-for="(data, field) in s460_fields"
                    :key="field"
                    :style="`width: ${data.width};`"
                    class="work-row-field d-flex align-center"
                  >
                    <v-textarea
                      v-model="s460[field]"
                      :rows="1"
                      auto-grow
                      hide-details
                      class="work-field work-field-small no-focus pa-0 ma-0"
                      :style="`font-size: ${column.textsize}px;`"
                      :disabled="!edit_mode"
                      :background-color="edit_mode ? 'white' : (get_column_color(column.name)) + ' lighten-4'"
                    />
                  </div>

                  <div
                    class="work-row-delete red"
                    v-if="edit_mode"
                    @click="open_remove_child_dialog(s460, 's460s')"
                  >
                    <v-icon color="white">mdi-delete</v-icon>
                  </div>
                </div>
              </div>
            </VueDraggable>
          </div>

          <div
            v-if="edit_mode"
            class="work-add-button"
            :class="add_s460_loading ? 'work-add-button-disabled grey' : 'green'"
            @click="add_s460"
          >
            <v-icon color="white" v-if="!add_s460_loading">mdi-plus</v-icon>
            <Loader :size="19" :width="3" :color="'white'" v-else />
          </div>
        </div>




        <!-- ############## Files ############## -->




        <div
          v-if="column.name == 'files'"
          class="work-rows lighten-3 d-flex flex-column"
          :class="self.color"
        >
          <div class="d-flex">
            <div
              v-for="(data, field) in file_fields"
              :key="field"
              :style="`width: ${data.width};`"
              class="work-row-field"
            >
              <div :class="self.color" class="work-column-subtitle lighten-5">
                <b>{{ data.name }}</b>
              </div>
            </div>
          </div>

          <div class="d-flex flex-grow-1">
            <div
              v-for="(data, field) in file_fields"
              :key="field + $tool.gen_uid()"
              :style="`width: ${data.width};`"
              class="work-subcolumn"
              @click="value_click($event, field + 's')"
            >
              <div
                class="lighten-3 d-flex flex-column"
                :class="self[field + 's_bg_color']"
                style="height: 100%;"
              >
                <div class="d-flex flex-column justify-center align-center flex-grow-1">
                  <div
                    v-for="(file, i) in self.files.filter(f => f.kind == field)"
                    :key="i"
                  >
                    <div
                      class="pa-2 ma-1 rounded text-center"
                      style="background-color: rgba(0, 0, 0, 0.1);"
                    >
                      <CustomButton
                        :icon="'mdi-file-pdf'"
                        :tooltip="file.name + '.' + file.extension"
                      />

                      <div
                        v-if="edit_mode"
                        class="d-flex mt-2 justify-space-beetween"
                      >
                        <CustomButton
                          :icon="'mdi-refresh'"
                          :tooltip="lang.generic.replace[lg]"
                          :small_fab="true"
                          :color="'white'"
                        />

                        <CustomButton
                          :icon="'mdi-delete'"
                          :tooltip="lang.generic.delete[lg]"
                          :small_fab="true"
                          :color="'white'"
                          @click="open_remove_child_dialog(file, 'files')"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="edit_mode"
                  class="work-add-button"
                  :class="add_file_loading ? 'work-add-button-disabled grey' : 'green'"
                  @click="add_file(field)"
                >
                  <v-icon color="white" v-if="!add_file_loading">mdi-plus</v-icon>
                  <Loader :size="19" :width="3" :color="'white'" v-else />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>




  <!-- ############## Expand ############## -->





  <div class="work-expand" v-if="expanded">
    <div class="lighten-5 pb-3" :class="self.color">
      <div class="pa-1" v-if="$is_editor">
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
</div>
</div>
</v-badge>

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
      log_entries: Object(),
      log_dialog: false,
      log_dialog_loading: true,
      message_dialog: false,
      message: '',
      message_selected_radiums: Array(),
      message_preset: 0,
      remove_dialog: false,
      add_shift_loading: false,
      add_limit_loading: false,
      add_s460_loading: false,
      add_file_loading: false,
      remove_child_dialog: false,
      remove_child_type: null,
      remove_child_item: null,
      link_radiums_snackbar: false,
      link_radiums_timeout: 4000,
      original_self: null,
    }
  },

  created() {
    if (this.self.newly_created) {
      this.edit_mode = true
      this.self.newly_created = false
    }

    this.original_self = this.$tool.deepcopy(this.self)
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
    is_clickable(column_name) {
      let clickables = ['colt', ]

      if (clickables.includes(column_name) && this.self[column_name] && this.self[column_name].length > 0 && !this.$current_component.palette) {
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

        if (content) {
          let textarea = content.getElementsByTagName('textarea')[0]
          let no_focus = content.getElementsByClassName('no-focus')

          if (textarea && no_focus.length == 0) {
            content.classList.add('work-column-value-focused')
            textarea.focus()
          }
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

      this.$current_component.filtered_works = this.$current_component.filtered_works.filter(w => w.id !== this.self.id)
      
      this.$current_component.rerender_count++
    },

    link_radiums() {
      this.link_radiums_dialog = false
      this.link_radiums_snackbar = true
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

        this.update()
      }

      else if (column && cc.palette && cc.palette_mode == 'columns') {
        this.self[column + '_bg_color'] = cc.palette_color

        this.update()
      }
    },

    get_column_color(column_name) {
      return this.self[column_name + '_bg_color'] ? this.self[column_name + '_bg_color'] : this.self.color
    },

    add_shift() {
      this.add_shift_loading = true

      setTimeout(() => {
        this.add_shift_loading = false
      }, 1000)
    },

    add_limit() {
      this.add_limit_loading = true

      setTimeout(() => {
        this.add_limit_loading = false
      }, 1000)
    },

    add_s460() {
      this.add_s460_loading = true

      setTimeout(() => {
        this.add_s460_loading = false
      }, 1000)
    },

    add_file(kind) {
      this.add_file_loading = true

      setTimeout(() => {
        console.log(kind)
        this.add_file_loading = false
      }, 1000)
    },

    open_remove_child_dialog(child, type) {
      this.remove_child_type = type
      this.remove_child_item = child
      this.remove_child_dialog = true
    },

    remove_child() {
      this.self[this.remove_child_type] = this.self[this.remove_child_type].filter(c => c.id !== this.remove_child_item.id)
      this.remove_child_dialog = false
    },

    update_child_position(type) {
      console.log(type)
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

    async update() {
      for (let key in this.self) {
        if ((typeof this.self[key] === 'string' || this.self[key] == null) && this.self[key] != this.original_self[key]) {
          this.log_entries[key] = this.self[key]
        }
      }

      this.original_self = this.$tool.deepcopy(this.self)
      
      await this.$http.post('works', {
        'action': 'update',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': 'work',
        'element_id': this.self.id,
        'value': this.log_entries,
      })

      this.log_entries = Object()
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

.work-field-small textarea {
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  padding-top: 9px !important;
  padding-bottom: 0px !important;
  line-height: 16px !important;
}

.work-field .v-input__slot {
  min-height: 0px !important;
}

.work-field fieldset {
  border: none !important;
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

</style>
