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
      v-for="(column, i) in columns"
      :key="i"
      class="work-column"
      :style="`min-width: ${Number(column.width) + (edit_mode && column.multiple && column.name != 'files' ? 70 : 0)}px; max-width: ${Number(column.width) + (edit_mode && column.multiple && column.name != 'files' ? 70 : 0)}px;`"
    >
      <div
        class="work-column-title"
        :class="!column.multiple ? 'cursor-pointer' : ''"
        @click="open_log_dialog(column.name)"
      >
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
        @click="value_click($event, column, self.columns[column.name])"
        @blur.capture="value_blur($event)"
        :class="[
          edit_mode ? 'white' : self.columns[column.name].bg_color,
          !edit_mode && self.columns[column.name].fields.length > 0 && self.columns[column.name].fields[0].value ? 'lighten-4' : 'lighten-2 accent-1',
          self.columns[column.name].clickable && !edit_mode ? 'work-column-value-clickable' : '',
          $current_component.palette && !edit_mode ? 'work-column-value-painter' : '',
        ]"
      >





        <!-- ############## Shifts ############## -->





        <div
          v-if="column.name == 'shifts'"
          class="align-self-start"
        >
          <div
            class="d-flex lighten-4 align-self-start"
            :class="get_column_color(column.name)"
          >
            <div class="work-drag-spacer" v-if="edit_mode"></div>

            <div class="work-column-subtitle" style="width: 30%; max-width: 30%; overflow: hidden;">
              {{ lang.generic.week[lg] }}
            </div>

            <div class="work-column-subtitle" style="width: 30%; max-width: 30%; overflow: hidden;">
              {{ lang.generic.day[lg] }}
            </div>

            <div class="work-column-subtitle" style="width: 40%; max-width: 40%; overflow: hidden;">
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




        <VueDraggable
          v-else
          v-model="self.columns[column.name].fields"
          @change="update_child_position(column.name)"
          :animation="100"
          easing="cubic-bezier(1, 0, 0, 1)"
          handle=".work-row-drag"
          style="width: 100%;"
        >


          <div
            v-for="(field, i) in self.columns[column.name].fields"
            :key="i"
            class="d-flex"
          >
            <div
              class="work-row-drag pink"
              v-if="edit_mode && column.multiple"
              :style="`cursor: ${grab_cursor};`"
              @mousedown="grab_cursor = 'grabbing'"
              @mouseup="grab_cursor = 'grab'"
              @mouseleave="grab_cursor = 'grab'"
            >
              <v-icon color="white" small>mdi-arrow-split-horizontal</v-icon>
            </div>




            <!-- ############## Limits ############## -->




            <Limit
              v-if="column.name == 'limits'"
              :self="field"
              :column="column"
              :parent_cpnt="$current_instance"
              :edit_mode="edit_mode"
              class="work-row-field"
            />




            <!-- ############## S460s ############## -->




            <S460
              v-if="column.name == 's460s'"
              :self="field"
              :column="column"
              :parent_cpnt="$current_instance"
              :edit_mode="edit_mode"
              class="work-row-field"
            />




            <!-- ############## Textarea ############## -->




            <textarea
              v-if="!column.multiple"
              v-model="field.value"
              @input="set_textarea_height($event, column, 2)"
              :style="get_textarea_style(column, 2)"
              style="width: 100%;"
              class="work-textarea my-2"
              :class="field.text_color ? field.text_color + '--text text--darken-3' : ''"
              :disabled="!edit_mode"
            ></textarea>



            <div
              v-if="edit_mode && column.multiple"
              class="work-row-delete red"
              @click="open_remove_child_dialog(field, 'limits')"
            >
              <v-icon color="white">mdi-delete</v-icon>
            </div>




          </div>
        </VueDraggable>
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
</v-badge>

</template>


<script>

import Shift from '@/views/radium/components/Shift.vue'
import Limit from '@/views/radium/components/Limit.vue'
import S460 from '@/views/radium/components/S460.vue'
import Table from '@/views/radium/components/Table.vue'

export default {
  name: 'Work',

  components: {
    Shift,
    Limit,
    S460,
    Table,
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
      this.expanded = true
      this.self.newly_created = false
    }

    this.self.work_fields.sort((a, b) => a.position - b.position)
    this.original_self = this.$tool.deepcopy(this.self)

    let columns = this.get_columns()
    this.$set(this.self, 'columns', columns)
  },

  computed: {
    columns() {
      return this.$current_component.columns.filter(c => c.visible)
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
  },

  methods: {
    get_columns() {
      let columns = Object()

      for (let column of this.$current_component.columns) {
        columns[column.name] = {
          'multiple': column.multiple,
          'bg_color': null,
          'text_color': null,
          'is_edited': false,
          'fields' : Array(),
        }

        let fields = this.self.work_fields.filter(
          f => f.name == column.name)

        for (let field of fields) {
          columns[column.name].bg_color = field.bg_color
          columns[column.name].text_color = field.text_color
          columns[column.name].is_edited = field.is_edited
          columns[column.name].fields.push(field)
        }
      }

      return columns
    },

    set_textarea_height(event, column, extra_height) {
      event.target.style.height = `${Number(column.textsize) + extra_height}px `
      event.target.style.height = `${event.target.scrollHeight + 2}px `
    },

    get_textarea_style(column, extra_height) {
      return `font-size: ${column.textsize}px;
              height: ${Number(column.textsize) + extra_height}px; `
    },

    get_column_color(field) {
      return !field ? '' : field.color
    },

    value_click(event, column, field) {
      if (!this.edit_mode && column.clickable && field.value) {
          window.open(column.path + field.value)
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
        this.set_color(field)
      }
    },

    value_blur(event) {
      let content = event.srcElement.closest('.work-column-value')
      content.classList.remove('work-column-value-focused')
    },

    set_color(field) {
      let cc = this.$current_component

      if (cc.palette && cc.palette_mode == 'works') {
        this.self.color = cc.palette_color

        this.update()
      }

      else if (field && cc.palette && cc.palette_mode == 'columns') {
        field.bg_color = cc.palette_color

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

    link_radiums() {
      this.link_radiums_dialog = false
      this.link_radiums_snackbar = true
    },



    // CRUD Methods




    async update() {
/*      for (let key in this.self) {
        if ((typeof this.self[key] === 'string' || this.self[key] == null) && this.self[key] != this.original_self[key]) {
          this.log_entries[key] = this.self[key]
        }
      }

      this.original_self = this.$tool.deepcopy(this.self)
      
      await this.$http.post('works', {
        'action': 'update_work',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'element_type': 'work',
        'element_id': this.self.id,
        'value': this.log_entries,
      })

      this.log_entries = Object()*/
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

    async add_file(kind) {
      this.add_file_loading = true

      setTimeout(() => {
        console.log(kind)
        this.add_file_loading = false
      }, 1000)
    },

    async add_child(type) {
      this['add_' + type + '_loading'] = true

      let request = await this.$http.post('works', {
        'action': 'create_child',
        'element_type': type,
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_id': this.self.id,
        'parent_type': 'work',
      })

      let element = request[type]
      this.self[type + 's'].push(element)

      this['add_' + type + '_loading'] = false
    },

    async update_child(child) {
      await this.$http.post('works', {
        'action': 'update_child',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_type': this.self.type,
        'parent_id': this.self.id,
        'element_type': child.type,
        'element_id': child.id,
        'value': child,
      })
    },

    async update_child_position(type) {
      let position_updates = Array()
      let i = 0

      for (let child of this.self[type]) {
        child.position = i
        i++

        position_updates.push({
          'element_id': child.id,
          'element_type': child.type,
          'element_position': child.position,
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
    },

    async remove_child() {
      this.self[this.remove_child_type] = this.self[this.remove_child_type].filter(c => c.id !== this.remove_child_item.id)
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
      })
    },

    send_message() {
      this.message_dialog = false

      // message request

      this.message = ''
      this.message_selected_radiums = Array()
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

.work-textarea {
  resize: none;
  text-align: center;
  outline: none;
}

.work-textarea:disabled {
  color: black;
}

</style>
