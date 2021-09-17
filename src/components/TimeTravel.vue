<template>

<div class="d-flex flex-wrap">
  <CustomButton
    :icon="'mdi-chevron-left'"
    :height="40"
    :outlined="true"
    class="mr-1 mb-1"
    @click="step_travel('previous')"
    :disabled="previous_disabled"
    :tooltip="previous_tooltip"
  />

  <v-dialog
    ref="dialog"
    v-model="date_dialog"
    width="290px"
    v-if="mode == 'day'"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="$tool.format_date(date)"
        :label="lang.views.nexus.select_date[lg]"
        readonly
        v-bind="attrs"
        v-on="on"
        outlined
        hide-details
        style="width: 160px;"
        class="time-travel-text-field mr-1"
      ></v-text-field>
    </template>

    <v-date-picker
      v-model="date"
      :first-day-of-week="1"
      :locale="`${lg}-${lg}`"
      scrollable
      no-title
      @input="go_to_date($event)"
      class="py-6"
    ></v-date-picker>
  </v-dialog>

  <v-select
    v-if="mode == 'month'"
    :items="months"
    v-model="current_month"
    item-text="month_name"
    item-value="month_number"
    :label="lang.generic.month[lg]"
    @change="select_travel_month"
    class="time-travel-select-month mr-1 mb-1"
    hide-details
    outlined
    dense
  ></v-select>

  <v-select
    v-if="mode != 'day'"
    :items="years"
    v-model="current_year"
    :label="lang.generic.year[lg]"
    @change="select_travel_year"
    class="time-travel-select-year mr-1 mb-1"
    hide-details
    outlined
    dense
  ></v-select>

  <CustomButton
    :icon="'mdi-chevron-right'"
    :height="40"
    :outlined="true"
    class="mr-1 mb-1"
    @click="step_travel('next')"
    :disabled="next_disabled"
    :tooltip="next_tooltip"
  />
</div>

</template>


<script>

export default {
  name: 'TimeTravel',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      current_month: null,
      current_year: null,
      years: ['2020', '2021', '2022', '2023'],
      date_dialog: false,
      date: null,
    }
  },

  created() {
    this.current_month = this.$current_month
    this.current_year = this.$current_year

    this.date = `${this.$route.params.year}-${this.$route.params.month}-${this.$route.params.day}`
  },

  computed: {
    months() {
      return [
        {month_name: this.lang.generic.january[this.lg], month_number: '1'},
        {month_name: this.lang.generic.february[this.lg], month_number: '2'},
        {month_name: this.lang.generic.march[this.lg], month_number: '3'},
        {month_name: this.lang.generic.april[this.lg], month_number: '4'},
        {month_name: this.lang.generic.may[this.lg], month_number: '5'},
        {month_name: this.lang.generic.june[this.lg], month_number: '6'},
        {month_name: this.lang.generic.july[this.lg], month_number: '7'},
        {month_name: this.lang.generic.august[this.lg], month_number: '8'},
        {month_name: this.lang.generic.september[this.lg], month_number: '9'},
        {month_name: this.lang.generic.october[this.lg], month_number: '10'},
        {month_name: this.lang.generic.november[this.lg], month_number: '11'},
        {month_name: this.lang.generic.december[this.lg], month_number: '12'},
      ]
    },

    mode() {
      let day_mode_views = ['myapexcontacts', ]
      let month_mode_views = ['calendar', 'works', 'board', ]

      if (month_mode_views.includes(this.$current_view)) {
        return 'month'
      }

      else if (day_mode_views.includes(this.$current_view)) {
        return 'day'
      }

      return 'year'
    },

    previous_disabled() {
      return (
        this.mode == 'month' &&
        this.$current_month == '1' &&
        this.$current_year == '2020'
      ) || (
        this.mode == 'year' &&
        this.$current_year == '2020'
      )
    },

    next_disabled() {
      return (
        this.mode == 'month' &&
        this.$current_month == '12' &&
        this.$current_year == '2023'
      ) || (
        this.mode == 'year' &&
        this.$current_year == '2023'
      )
    },

    previous_tooltip() {
      if (this.mode == 'day') {
        return this.lang.generic.previous_day[this.lg]
      }
      
      else if (this.mode == 'month') {
        return this.lang.generic.previous_month[this.lg]
      }

      else if (this.mode == 'year') {
        return this.lang.generic.previous_year[this.lg]
      }

      return this.lang.generic.previous_year[this.lg]
    },

    next_tooltip() {
      if (this.mode == 'day') {
        return this.lang.generic.next_day[this.lg]
      }

      else if (this.mode == 'month') {
        return this.lang.generic.next_month[this.lg]
      }

      else if (this.mode == 'year') {
        return this.lang.generic.next_year[this.lg]
      }

      return this.lang.generic.next_year[this.lg]
    },
  },

  methods: {
    step_travel(direction) {
      let target_day, target_month, target_year

      let day = Number(this.$current_day)
      let month = Number(this.$current_month)
      let year = Number(this.$current_year)

      let date = new Date(`${year}-${month}-${day}`)

      if (this.mode == 'day') {
        if (direction == 'previous') {
          date.setDate(date.getDate() - 1)
        }
        
        else if (direction == 'next') {
          date.setDate(date.getDate() + 1)
        }
          
        target_day = date.getDate()
        target_month = date.getMonth() + 1
        target_year = date.getFullYear()

        this.$router.replace({params: {
          day: target_day,
          month: target_month,
          year: target_year,
        }})
      }

      else if (this.mode == 'month') {
        if (direction == 'previous') {
          target_month = month == 1 ? String(12) : String(month - 1)
          target_year = month == 1 ? String(year - 1) : String(year)
        }

        else if (direction == 'next') {
          target_month = month == 12 ? String(1) : String(month + 1)
          target_year = month == 12 ? String(year + 1) : String(year)
        }

        this.$router.replace({params: {month: target_month, year: target_year}})
      }

      else if (this.mode == 'year') {
        if (direction == 'previous') {
          target_year = String(year - 1)
        }

        else if (direction == 'next') {
          target_year = String(year + 1)
        }

        this.$router.replace({params: {year: target_year}})
      }
    },

    select_travel_month() {
      this.$router.replace({params: {month: this.current_month}})
    },

    select_travel_year() {
      this.$router.replace({params: {year: this.current_year}})
    },

    go_to_date(event) {
      let [year, month, day] = event.split('-')

      if (this.$current_view == 'myapexcontacts') {
        this.$router.push(`/myapex/nexus/${this.$current_app_id}/contacts/day/${day}/month/${month}/year/${year}`)
      }
    },
  },

  watch: {

  },
}

</script>


<style>

.time-travel-text-field .v-input__slot {
  min-height: 40px !important;
}

</style>


<style scoped>

.time-travel-select-month {
  width: 150px;
}

.time-travel-select-year {
  width: 95px;
}

</style>
