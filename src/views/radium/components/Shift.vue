<template>

<div class="shift-frame">
  <div class="shift-cell" style="width: calc(30% - 1px);">
    <div
      class="d-flex justify-center align-center lighten-3"
      :class="parent.shifts_bg_color ? parent.shifts_bg_color : parent.color"
      style="width: 100%; height: 100%;"
    >
      {{ new Date(self.date).getWeek() }}
    </div>
  </div>

  <div
    class="shift-cell"
    :class="[
      edit_mode ? 'shift-background-white' : '',
      edit_mode ? 'cursor-pointer' : '',
    ]"
    style="width: 30%;"
    @click="open_date_dialog()"
  >
    <div
      class="text-center"
      style="line-height: 16px;"
    >
      <small><b>{{ lang.generic[day_data.day_name][lg].toUpperCase().substring(0,3) }}</b><br></small>
      {{ day_data['day_number'] }}/{{ day_data['month'] }}
    </div>
  </div>

  <div
    class="shift-cell flex-column justify-space-between"
    :class="edit_mode ? 'shift-background-white' : ''"
    style="width: 40%;"
  >
    <div class="d-flex" style="width: 100%;">
      <div
        v-for="(color, i) in day_data['shift_colors']"
        :key="i"
        class="shift-date-color lighten-1"
        :class="color"
      ></div>
    </div>

    <v-combobox
      v-model="self.shift"
      :items="shift_types"
      class="shift-combobox"
      :style="`font-size: ${column.textsize}px;`"
      hide-details
      :append-icon="null"
      :disabled="!edit_mode"
      :background-color="edit_mode ? 'white' : ''"
    ></v-combobox>

    <div class="d-flex" style="width: 100%;">
      <div
        v-for="(color, i) in day_data['shift_colors']"
        :key="i"
        class="shift-date-color lighten-1"
        :class="color"
      ></div>
    </div>
  </div>

  <v-dialog
    ref="dialog"
    width="290px"
    v-model="date_dialog"
  >
    <v-date-picker
      class="work-date-picker pt-5"
      v-model="self.date"
      :first-day-of-week="1"
      locale="fr-fr"
      no-title
    ></v-date-picker>
  </v-dialog>
</div>

</template>


<script>

export default {
  name: 'Shift',

  components: {
    
  },

  props: {
    self: Object,
    parent: Object,
    column: Object,
    edit_mode: Boolean,
  },

  data() {
    return {
      shift_types: [
        '06-14',
        '08-16',
        '12-20',
        '14-22',
        '22-06',
        '00-08',
      ],
      date_dialog: false,
    }
  },

  created() {

  },

  computed: {
    day_data() {
      let day_number = ''
      let day_name = ''
      let month = ''
      let week = ''
      let shift_colors = ['grey', 'grey']

      if (this.self.date) {
        let date = new Date(this.self.date)

        day_number = date.getDate()
        day_number = day_number > 9 ? day_number : '0' + day_number
        day_name = date.toLocaleDateString('en-en', { weekday: 'long' }).toLowerCase()
        month = date.getMonth() + 1
        month = month > 9 ? month : '0' + month
        week = name == 'sunday' ? date.getWeek() - 1 : date.getWeek()

        if (this.self.shift) {
          if (day_name == 'friday') {
            if (parseInt(this.self.shift.substring(0, 2)) >= 20) {
              shift_colors = ['grey', 'blue']
            }
          }

          else if (day_name == 'saturday') {
            if (parseInt(this.self.shift.substring(0, 2)) >= 20) {
              shift_colors = ['blue', 'red']
            }

            else {
              shift_colors = ['blue', 'blue']
            }
          }

          else if (day_name == 'sunday') {
            if (parseInt(this.self.shift.substring(0, 2)) >= 20) {
              shift_colors = ['red', 'grey']
            }

            else {
              shift_colors = ['red', 'red']
            }
          }
        }
      }

      else {
        shift_colors = ['', '']
      }

      return {
        'day_number': day_number,
        'day_name': day_name,
        'month': month,
        'week': week,
        'shift_colors': shift_colors,
      }
    },

    date() {
      return this.self.date
    }
  },

  methods: {
    open_date_dialog() {
      if (this.edit_mode) {
        this.date_dialog = true
      }
    },
  },

  watch: {
    date() {
      this.date_dialog = false
    },
  }
}

</script>


<style>

.shift-combobox input {
  text-align: center;
  height: 31px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
}

.shift-combobox input:disabled {
  color: black !important;
}

.shift-combobox.v-text-field {
  padding: 0px;
  margin: 0px;
}

.shift-combobox .v-input__slot:before {
  border: none !important;
}

</style>


<style scoped>

.shift-frame {
  height: 50px;
  display: flex;
  border-bottom: 1px grey solid;
}

.shift-frame:not(:first-child) {
  border-bottom: 1px grey solid;
}

.shift-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  background-color: rgba(255, 255, 255, 0.5);
}

.shift-cell:last-child {
  width: 40%;
}

.shift-cell:not(:first-child) {
  border-left: 1px grey solid;
}

.shift-date-color {
  height: 9px;
  width: 50%;
}

.shift-background-white {
  background-color: white;
}

.shift-combobox {
  text-align: center;
}

</style>
