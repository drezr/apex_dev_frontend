<template>

<div class="shift-frame">
  <div class="shift-cell">
    <div
      class="d-flex justify-center align-center lighten-3"
      :class="parent.shifts_bg_color ? parent.shifts_bg_color : parent.color"
      style="width: 100%; height: 100%;"
    >
      {{ new Date(self.date).getWeek() }}
    </div>
  </div>

  <div class="shift-cell">
    <div class="text-center" style="line-height: 16px;">
      <small><b>{{ day_data['day_name'] }}</b><br></small>
      {{ day_data['day_number'] }}/{{ day_data['month'] }}
    </div>
  </div>

  <div class="shift-cell flex-column justify-space-between">
    <div class="d-flex" style="width: 100%;">
      <div
        v-for="(color, i) in day_data['shift_colors']"
        :key="i"
        class="shift-date-color lighten-1"
        :class="color"
      ></div>
    </div>

    {{ self.shift }}

    <div class="d-flex" style="width: 100%;">
      <div
        v-for="(color, i) in day_data['shift_colors']"
        :key="i"
        class="shift-date-color lighten-1"
        :class="color"
      ></div>
    </div>
  </div>
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
  },

  data() {
    return {
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
        day_name = date.toLocaleDateString('fr-fr', { weekday: 'short' })
                   .toUpperCase().slice(0, -1)
        month = date.getMonth() + 1
        month = month > 9 ? month : '0' + month
        week = name == 'DIM' ? date.getWeek() - 1 : date.getWeek()

        if (this.self.shift) {
          if (day_name == 'VEN') {
            if (parseInt(this.self.shift.substring(0, 2)) >= 20) {
              shift_colors = ['grey', 'blue']
            }
          }

          else if (day_name == 'SAM') {
            if (parseInt(this.self.shift.substring(0, 2)) >= 20) {
              shift_colors = ['blue', 'red']
            }

            else {
              shift_colors = ['blue', 'blue']
            }
          }

          else if (day_name == 'DIM') {
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
  },

  methods: {
    async remove() {

    },
  },

  watch: {

  }
}

</script>


<style>


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
}

.shift-cell:last-child {
  width: 40%;
}

.shift-cell:not(:first-child) {
  border-left: 1px grey solid;
}

.shift-date-color {
  height: 10px;
  width: 50%;
}

</style>
