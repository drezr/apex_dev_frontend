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

            <div class="board-date-children" v-if="date.data">
              <div
                v-for="(part, i) in date.data.parts"
                :key="i + $tool.gen_uid()"
                class="board-date-children-frame"
              >
                <div class="board-date-children-child">
                  <Part
                    :self="part"
                    :parent="date.data"
                  />
                </div>

                <div
                  class="board-date-children-teammates"
                  @click="open_teammates_dialog(date.data, part)"
                >
                  <div
                    v-if="part.teammates.length > 0"
                    class="d-flex justify-center flex-wrap"
                  >
                    <v-chip
                      v-for="(teammate, i) in $get_sorted_teammates(part.teammates)"
                      :key="i"
                      class="mb-1 mr-1 px-2 lighten-4 cursor-pointer"
                      :color="teammate.color"
                      small
                    >
                      <v-icon size="22" class="mr-2">mdi-account-circle</v-icon>

                      {{ teammate.name }}
                    </v-chip>
                  </div>

                  <div
                    v-else
                    class="d-flex justify-center align-center"
                  >
                    <v-icon>mdi-account-group</v-icon>
                  </div>
                </div>
              </div>

              <div
                v-for="(child, i) in date.data.children"
                :key="i"
                class="board-date-children-frame"
              >
                <div class="board-date-children-child">
                  <Task
                    v-if="child.type == 'task'"
                    :self="child"
                    :parent="date.data"
                  />
                  
                  <Note
                    v-if="child.type == 'note'"
                    :self="child"
                    :parent="date.data"
                  />
                  
                  <File
                    v-if="child.type == 'file'"
                    :self="child"
                    :parent="date.data"
                  />
                </div>

                <div
                  class="board-date-children-teammates"
                  @click="open_teammates_dialog(date.data, child)"
                >
                  <div
                    v-if="child.teammates.length > 0"
                    class="d-flex justify-center flex-wrap"
                  >
                    <v-chip
                      v-for="(teammate, i) in $get_sorted_teammates(child.teammates)"
                      :key="i"
                      class="mb-1 mr-1 px-2 lighten-4 cursor-pointer"
                      :color="teammate.color"
                      small
                    >
                      <v-icon size="22" class="mr-2">mdi-account-circle</v-icon>

                      {{ teammate.name }}
                    </v-chip>
                  </div>

                  <div
                    v-else
                    class="d-flex justify-center align-center"
                  >
                    <v-icon>mdi-account-group</v-icon>
                  </div>
                </div>
              </div>
            </div>

            <div class="board-date-children" v-else></div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <CustomDialog
    v-if="teammates_dialog"
    :open="teammates_dialog"
    :width="500"
    :title_text="lang.views.planner.edit_teammates[lg]"
    @cancel="teammates_dialog = false"
  >
    <div class="mt-6" style="width: fit-content; margin: auto;">
      <div
        v-for="(profile, i) in team.profiles"
        :key="i"
        class="d-flex"
      >
        <div
          class="board-task-count"
          :class="get_task_count(profile) == 0 ? 'green' : 'blue'"
        >
          {{ get_task_count(profile) }}
        </div>

        <v-checkbox
          class="my-0 pa-0"
          :label="profile.name"
          :input-value="teammates_object.teammates.find(t => t == profile.name)"
          @change="toggle_teammate(profile)"
        >
        </v-checkbox>

        <div
          class="board-presence"
          v-if="profile.presence || profile.absence"
        >
          <span
            class="board-presence-cell"
            :class="[
              select_presence_color(profile.presence),
              profile.absence != '' ? 'board-presence-border-right' : ''
            ]"
            v-if="profile.presence && profile.presence != ''"
          >
            {{ profile.presence }}
          </span>

          <span
            class="board-presence-cell"
            :class="[
              select_presence_color(profile.absence),
              profile.presence != '' ? 'board-presence-border-left' : ''
            ]"
            v-if="profile.absence && profile.absence != ''"
          >
            {{ profile.absence }}
          </span>
        </div>
      </div>
    </div>
  </CustomDialog>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import Part from '@/components/Part.vue'
import Task from '@/components/Task.vue'
import Note from '@/components/Note.vue'
import File from '@/components/File.vue'

export default {
  name: 'Board',

  components: {
    NavigationBar,
    Task,
    Note,
    File,
    Part,
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
      teammates_object: null,
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
        'data': null,
      }

      let day = this.days.find(d => new Date(d.date).getDay() == i - 1)

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

    async open_teammates_dialog(day, child) {
      this.teammates_day = day
      this.teammates_object = child

      this.request = await this.$http.get('presences', {
        'team_id': this.team.id,
        'date': day.date,
      })

      for (let presence of this.request.presences) {
        let profile = this.profiles.find(p => p.id == presence.profile_id)

        profile.presence = presence.presence
        profile.absence = presence.absence
      }

      this.teammates_dialog = true
    },

    toggle_teammate(profile) {
      if (this.teammates_object.teammates.find(t => t == profile.name)) {
        this.teammates_object.teammates = this.teammates_object.teammates.filter(
          t => t !== profile.name)
      }

      else {
        this.teammates_object.teammates.push(profile.name)
      }
    },

    select_presence_color(value) {
      let color = 'red--text text--accent-4'

      if (value) {
        value = value.toUpperCase()

        if (value.includes('P')) color = 'green--text text--darken-2'
        if (value.includes('PN')) color = 'blue--text text--darken-4'
        if (value.includes('AP')) color = 'red--text text--darken-4'
      }

      return color
    },

    get_task_count(profile) {
      let children = this.teammates_day.parts.concat(this.teammates_day.children)
      let count = 0

      for (let child of children) {
        if (child.teammates.find(t => t == profile.name)) {
          count++
        }
      }

      return count
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
  min-height: 60px;
}

.board-date:not(:last-child) {
  border-bottom: 5px rgba(0, 0, 0, 0.6) solid;
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
  border-left: 1px black solid;

}

.board-date-children-frame {
  display: flex;
}

.board-date-children-frame:not(:last-child) {
  border-bottom: 1px black solid;
}

.board-date-children-child {
  flex-grow: 1;
  width: 70%;
  min-width: 500px;
  padding: 12px;
}

.board-date-children-teammates {
  flex-grow: 1;
  border-left: 1px black solid;
  width: 30%;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  transition: background-color .5s;
  padding: 6px;
}

.board-date-children-teammates:hover {
  background-color: rgba(0, 100, 255, 0.1);
}

.board-presence {
  position: relative;
  top: -1px;
  display: inline-flex;
  text-transform: uppercase;
  font-weight: bold;
  margin-left: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  height: 27px;
}

.board-presence-cell {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.board-presence-border-left {
  border-left: 1px rgba(0, 0, 0, 0.2) solid;
}

.board-presence-border-right {
  border-right: 1px white solid;
}

.board-task-count {
  position: relative;
  top: -3px;
  left: -10px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

</style>
