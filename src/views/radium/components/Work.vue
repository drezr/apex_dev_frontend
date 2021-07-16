<template>

<div class="work-overframe">
  <div class="work-frame lighten-5" :class="self.color">
    <div
      class="work-expand-button"
      :class="self.color"
      @click="expanded = !expanded"
    >
      <v-icon>mdi-chevron-{{ expanded ? 'up' : 'down' }}</v-icon>
    </div>

    <div
      v-for="(column, i) in $parent.$parent.columns"
      :key="i"
      class="work-column"
      :style="`min-width: ${column.width}px;`"
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
        ]"
        @click="value_click($event)"
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

      </div>
    </div>
  </div>

  <div class="work-expand" v-if="expanded">
    <div class="lighten-5" :class="self.color">
      <div class="pa-1">
        <CustomButton
          :text="edit_mode ? lang.generic.lock[lg] : lang.generic.edit[lg]"
          :rounded="true"
          :color="edit_mode ? 'blue' : 'teal'"
          :dark="true"
          :icon="edit_mode ? 'mdi-lock' : 'mdi-pencil'"
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
        />

        <CustomButton
          :text="lang.generic.message[lg]"
          :rounded="true"
          :color="'deep-orange'"
          :dark="true"
          :icon="'mdi-android-messages'"
          :tooltip="lang.views.radium.message_tooltip[lg]"
          class="mr-3"
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
          :tooltip="lang.views.radium.link_tooltip[lg]"
          class="mr-3"
          @click="link_dialog = true"
        />
      </div>

      <Table
        :parent="self"
        :parent_cpnt="$current_instance"
      />
    </div>
  </div>

  <CustomDialog
    :open="link_dialog"
    :width="500"
    :title_text="lang.views.radium.link_tooltip[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-link-variant-plus'"
    :confirm_text="lang.generic.to_link[lg]"
    :confirm_color="'purple'"
    @cancel="link_dialog = false"
    @confirm="link_teams"
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
                  :label="`${team.name} (${app.name})`"
                  hide-details
                  @change="toggle_radium(app.id)"
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
      link_dialog: false,
      link_selected_radiums: Array(),
    }
  },

  created() {
    //console.log(this.self)
  },

  computed: {

  },

  methods: {
    value_click(event) {
      if (this.edit_mode) {
        let cell = event.target.closest('.work-column-value')
        let textarea = cell.getElementsByTagName('textarea')[0]

        if (textarea) {
          cell.classList.add('work-column-value-focused')
          textarea.focus()
        }
      }
    },

    value_blur(event) {
      let content = event.srcElement.closest('.work-column-value')
      content.classList.remove('work-column-value-focused')
    },

    remove() {

    },

    link_teams() {

    },

    toggle_radium(app_id) {
      if (this.link_selected_radiums.includes(app_id)) {
        this.link_selected_radiums = this.link_selected_radiums.filter(
          id => id !== app_id)
      }

      else {
        this.link_selected_radiums.push(app_id)
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

</style>


<style scoped>

.work-overframe {
  border: 1px black solid;
  min-width: min-content;
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
  border-top:  1px black solid;
}

.work-expand-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  cursor: pointer;
}

.work-expand-button:hover {
  filter:  brightness(1.3);
}

.work-link-expension-panel {
  border: 1px rgba(0, 0, 0, 0.3) solid;
}

</style>
