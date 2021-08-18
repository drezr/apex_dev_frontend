<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title">
        {{ team.name }}
      </div>

      <NavigationBar class="mb-3" />

      <div class="d-flex">
        <div class="board-pending">
          <VueDraggable
            v-model="app.children"
            @change="update_children_position"
            :animation="100"
            easing="cubic-bezier(1, 0, 0, 1)"
            handle=".handle"
          >
            <div
              v-for="(child, i) in app.children"
              :key="i"
            >
              <Task
                v-if="child.type == 'task'"
                :self="child"
                :parent="app"
                class="ma-1"
              />
            </div>
          </VueDraggable>
        </div>

        <div class="board-planned">
          <div
            v-for="(date, i) in dates"
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
              <div class="board-date-children-child"></div>
              <div class="board-date-children-teammates"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import Task from '@/components/Task.vue'

export default {
  name: 'Board',

  components: {
    NavigationBar,
    Task,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      days: Array(),
      dates: Array(),
      detail_edit_mode: true
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
        'data': null,
      }

      let day = this.days.find(d => new Date(d.date).getDay() == i)

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
    update_children_position() {

    },

    get_day_color(day_name) {
      if (day_name == 'saturday') {
        return 'blue'
      }

      else if (day_name == 'sunday') {
        return 'red'
      }

      return ''
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.board-pending {
  width: 35%;
  min-width: 500px;
  height: calc(100vh - 250px);
  max-height: calc(100vh - 235px);
  border: 1px black solid;
  border-radius: 5px;
  margin: 10px;
  overflow-y: scroll;
}

.board-planned {
  width: 65%;
  min-width: 880px;
  height: calc(100vh - 250px);
  max-height: calc(100vh - 235px);
  border: 1px black solid;
  border-radius: 5px;
  margin: 10px;
  overflow-y: scroll;
}

.board-date {
  display: flex;
}

.board-date:not(:last-child) {
  border-bottom: 3px rgba(0, 0, 0, 0.7) solid;
}

.board-date-day {
  width: 60px;
  min-width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.board-date-children {
  flex-grow: 1;
  border-left: 1px black solid;
  display: flex;
}

.board-date-children-child {
  flex-grow: 1;
  width: 70%;
  min-width: 500px;
  height: 60px;
}

.board-date-children-teammates {
  flex-grow: 1;
  border-left: 1px black solid;
  width: 30%;
  min-width: 300px;
  height: 60px;
}

</style>
