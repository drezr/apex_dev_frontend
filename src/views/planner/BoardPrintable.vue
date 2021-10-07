<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" class="board-printable-area">
      <div class="d-flex flex-start align-center my-1 mx-3 text-h5">
        {{ team.name }}
        {{ app.name ? `(${app.name})` : '' }} -
        {{ lang.views.planner.planning[lg] }}
        {{ $tool.format_date_month_name_year(`${$current_year}-${$current_month}`, lg) }}

        <CustomButton
          :icon="'mdi-printer'"
          :height="40"
          :outlined="true"
          class="ml-3 no-print"
          @click="print_document"
        />
      </div>


      <div class="d-flex">
        <div class="board-planned">
          <div
            v-for="(date, i) in dates.filter(d => (d.data.parts && d.data.parts.length > 0) || (d.data.tasks && d.data.tasks.length > 0))"
            :key="i"
            class="board-date"
          >
            <div
              class="board-date-day lighten-3"
              :class="get_day_color(date.day_name)"
            >
              <div class="text-center">
                <small>{{ lang.generic[date.day_name][lg].toUpperCase().substring(0,3) }}</small><br>
                <b>{{ date.day }}/{{ date.month }}</b>
              </div>
            </div>

            <div class="board-date-children">
              <div
                v-for="(part, i) in date.data.parts"
                :key="i + $tool.gen_uid()"
                class="board-date-children-frame"
              >
                <div class="board-date-children-child">
                  <div class="mb-1">    
                    <small>
                      <b>{{ lang.generic.shift[lg] }}:</b>
                      {{ part.shift.shift }}
                    </small>
                  </div>

                  <div>
                    {{ part.work.description }}
                  </div>
                </div>

                <div
                  class="board-date-children-teammates"
                >
                  <div
                    v-if="part.teammates.length > 0"
                    class="d-flex justify-center align-center flex-wrap"
                  >
                    <v-chip
                      v-for="(teammate, i) in $get_sorted_teammates(part.teammates)"
                      :key="i"
                      class="mb-1 mr-1 lighten-4 cursor-pointer"
                      :color="teammate.color"
                      small
                    >
                      {{ teammate.name }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <div
                v-for="(child, i) in date.data.tasks"
                :key="i"
                class="board-date-children-frame"
              >
                <div class="board-date-children-child">
                  <div
                    class="text-center mb-1"
                    v-for="(input, i) in child.inputs.filter(c => c.heading)"
                    :key="i"
                  >
                    <small>
                      <b>{{ input.key }}:</b>
                      {{ input.kind == 'date' ? $tool.format_date(input.value) : input.value }}
                    </small>
                  </div>

                  <div>
                    {{ child.name }}
                  </div>
                </div>

                <div
                  class="board-date-children-teammates"
                >
                  <div
                    v-if="child.teammates.length > 0"
                    class="d-flex flex-wrap"
                  >
                    <v-chip
                      v-for="(teammate, i) in $get_sorted_teammates(child.teammates)"
                      :key="i"
                      class="mb-1 mr-1 lighten-4 cursor-pointer"
                      :color="teammate.color"
                      small
                    >
                      {{ teammate.name }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>

</template>


<script>


export default {
  name: 'BoardPrintable',

  components: {

  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      profiles: Array(),
      app: Object(),
      days: Array(),
      dates: Array(),
      detail_edit_mode: true,
      teammates_dialog: false,
      teammates_day: null,
    }
  },

  async created() {
    this.request = await this.$http.get('planner', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.profiles = this.request.team.profiles
    this.app = this.request.app
    this.days = this.request.days

    let children = this.$tool.get_fused_children(this.app)
    children = this.$tool.deepcopy(children)
    this.$set(this.app, 'children', children)

    let month = new Date(this.$current_year, this.$current_month, 0)
    let day_count = month.getDate()


    for (let i = 1; i <= day_count; i++) {
      let date = new Date(this.$current_year, this.$current_month - 1, i)
      let day_name = date.toLocaleDateString('en-en', {weekday: 'long'}).toLowerCase()
      let m = Number(this.$current_month)

      let day_data = {
        'day_name': day_name,
        'day': i = i > 9 ? i : '0' + i,
        'month': m = m > 9 ? m : '0' + m,
        'year': Number(this.$current_year),
        'data': {children: Array()},
      }

      let day = this.days.find(d => new Date(d.date).getDate() == i)

      if (day) {
        children = this.$tool.get_fused_children(day)
        children = this.$tool.deepcopy(children)
        this.$set(day, 'children', children)

        day_data.data = day
      }

      this.dates.push(day_data)
    }

    this.loading = false
  },

  computed: {

  },

  methods: {
    get_day_color(day_name) {
      if (day_name == 'saturday') {
        return 'blue'
      }

      else if (day_name == 'sunday') {
        return 'red'
      }

      return 'grey'
    },

    print_document() {
      print()
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

@media print {
  .board-printable-area {
    background-color: white;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 15px;
    font-size: 14px;
    line-height: 18px;
  }
}

.board-planned {
  min-width: 750px;
  border: 1px black solid;
  border-radius: 5px;
}

.board-date {
  display: flex;
  min-height: 50px;
  break-inside: avoid;
}

.board-date:not(:last-child) {
  border-bottom: 8px rgba(0, 0, 0, 0.8) solid;
}

.board-date-day {
  width: 60px;
  min-width: 60px;
  height: available;
  display: flex;
  justify-content: center;
  align-items: center;
}

.board-date-children {
  flex-grow: 1;
  border-left: 2px black solid;
}

.board-date-children-frame {
  display: flex;
}

.board-date-children-frame:not(:last-child) {
  border-bottom: 2px black solid;
}

.board-date-children-child {
  flex-grow: 1;
  width: 400px;
  padding: 12px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.board-date-children-teammates {
  flex-grow: 1;
  border-left: 1px black solid;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  transition: background-color .5s;
  padding: 6px;
}

</style>
