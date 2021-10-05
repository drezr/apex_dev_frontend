<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title mt-6">
        {{ team.name ? team.name : $logged_profile.name }}
      </div>

      <v-card class="mx-auto my-10" max-width="600">
        <v-toolbar color="deep-purple" class="elevation-1" dark>
          <v-toolbar-title>
            <v-icon x-large class="mr-3">mdi-cogs</v-icon>
            {{ lang.views.draft.ongoing_projects[lg] }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <CustomButton
            :icon="'mdi-plus'"
            :color="'green'"
            :dark="true"
            :tooltip="lang.views.draft.create_new_project[lg]"
            @click="create_dialog = true"
          />
        </v-toolbar>

        <v-list>
          <v-list-item v-if="ongoing.length == 0">
            <v-list-item-content class="d-flex justify-center py-5 text-center">
              {{ lang.views.draft.tip_no_ongoing_project[lg] }}<br>
              {{ lang.views.draft.tip_create_new_project[lg] }}
            </v-list-item-content>
          </v-list-item>

          <VueDraggable
            v-model="ongoing"
            @change="update_position"
            :animation="100"
            easing="cubic-bezier(1, 0, 0, 1)"
            handle=".handle"
          >
            <router-link
              v-for="project in ongoing"
              :key="project.id"
              :to="get_route(project.id)"
              class="projects-ongoing-project"
            >
              <CustomButton
                :icon="'mdi-drag'"
                :small_fab="true"
                :text_color="'pink'"
                :tooltip="lang.generic.move[lg]"
                :cursor="grab_cursor"
                @mousedown="grab_cursor = 'grabbing'"
                @mouseup="grab_cursor = 'grab'"
                @mouseleave="grab_cursor = 'grab'"
                class="handle"
                @click.native.stop
              />

              <v-icon class="mx-3">
                mdi-clipboard-check-multiple-outline
              </v-icon>

              <div class="flex-grow-1">
                {{ project.name }}
              </div>

              <v-chip class="ml-1 white--text grey darken-3" small>
                {{ $tool.format_date(`${project.date}`) }}
              </v-chip>
            </router-link>
          </VueDraggable>
        </v-list>
      </v-card>

      <v-card class="mx-auto mb-10" max-width="600">
        <v-toolbar color="purple" class="elevation-1" dark>
          <v-toolbar-title>
            <v-icon x-large class="mr-3">mdi-folder</v-icon>
            {{ lang.views.draft.archived_projects[lg] }}
          </v-toolbar-title>
        </v-toolbar>

        <v-list>
          <v-list-item v-if="Object.keys(archived).length == 0">
            <v-list-item-content class="d-flex justify-center py-5 text-center">
              {{ lang.views.draft.tip_no_archived_project[lg] }}
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            no-action
            v-for="(i, year) in archived"
            :key="year"
          >
            <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ year }}</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-group
              no-action
              sub-group
              v-for="(i, month) in archived[year]"
              :key="month"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ months[month] }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="project in archived[year][month]"
                :key="project.id"
                class="pl-6"
                :to="get_route(project.id)"
                link
              >
                <v-list-item-icon class="ml-10">
                  <v-icon>mdi-clipboard-check-multiple-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{ project.name }}
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list>
      </v-card>
    </div>
  </transition>

  <CustomDialog
    v-if="create_dialog"
    :open="create_dialog"
    :width="500"
    :title_text="lang.views.draft.create_new_project[lg]"
    :title_bg_color="'green lighten-4'"
    @cancel="create_dialog = false"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-plus'"
    :confirm_text="lang.generic.create[lg]"
    :confirm_color="'green'"
    @confirm="create_project"
  >
    <v-text-field
      v-model="new_project_name"
      :label="lang.views.draft.project_name[lg]"
      outlined
      class="mt-6"
    ></v-text-field>

    <v-dialog
      ref="dialog"
      v-model="date_dialog"
      width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :value="$tool.format_date(new_project_date)"
          :label="lang.views.draft.project_date[lg]"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
          outlined
          hide-details
        ></v-text-field>
      </template>

      <v-date-picker
        v-model="new_project_date"
        :first-day-of-week="1"
        locale="fr-fr"
        scrollable
        no-title
        @input="date_dialog = false"
        class="py-6"
      ></v-date-picker>
    </v-dialog>

    <div class="mx-3 mt-6 mb-3">
      <v-checkbox
        v-model="new_project_private"
        :label="lang.views.draft.private[lg]"
        :hint="lang.views.draft.private_hint[lg]"
        persistent-hint
      ></v-checkbox>
    </div>
  </CustomDialog>
</div>

</template>


<script>

export default {
  name: 'Projects',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      request: null,
      team: Object(),
      profiles: Array(),
      app: Object(),
      ongoing: Array(),
      archived: Object(),
      grab_cursor: 'grab',
      create_dialog: false,
      date_dialog: false,
      new_project_name: null,
      new_project_date: null,
      new_project_private: null,
    }
  },

  async created() {
    if (this.$current_view == 'projects') {
      this.request = await this.$http.get('draft', {
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
      })

      this.team = this.request.team
      this.profiles = this.request.team.profiles
    }

    else if (this.$current_view == 'myapexprojects') {
      this.request = await this.$http.get('myapexdraft', {
        'app_id': this.$current_app_id,
      })
    }

    this.app = this.request.app

    this.ongoing = this.get_ongoing()
    this.archived = this.get_archived()

    this.loading = false
  },

  computed: {
    months() {
      return {
        '1': this.lang.generic.january[this.lg],
        '2': this.lang.generic.february[this.lg],
        '3': this.lang.generic.march[this.lg],
        '4': this.lang.generic.april[this.lg],
        '5': this.lang.generic.may[this.lg],
        '6': this.lang.generic.june[this.lg],
        '7': this.lang.generic.july[this.lg],
        '8': this.lang.generic.august[this.lg],
        '9': this.lang.generic.september[this.lg],
        '10': this.lang.generic.october[this.lg],
        '11': this.lang.generic.november[this.lg],
        '12': this.lang.generic.december[this.lg],
      }
    },
  },

  methods: {
    get_ongoing() {
      let ongoing = this.app.projects.filter(p => !p.archived)

      if (!this.$xs.draft_can_see_private && this.$current_view != 'myapexprojects') {
        ongoing = ongoing.filter(p => !p.private)
      }

      ongoing.sort((a, b) => a.link.position - b.link.position)

      return ongoing
    },

    get_archived() {
      let archived = this.app.projects.filter(p => p.archived)
      let projects = Object()
      let csp = this.$xs.draft_can_see_private  && this.$current_view != 'myapexprojects'

      for (let project of archived) {
        if (!project.private || (csp && project.private)) {
          let year = new Date(project.date).getFullYear()
          let month = new Date(project.date).getMonth() + 1

          if (!(year in projects)) {
            projects[year] = Object()

            if (!(month in projects[year])) {
              projects[year][month] = Array()
            }

            projects[year][month].unshift(project)
          }

          else {
            if (!(month in projects[year])) {
              projects[year][month] = Array()
            }

            projects[year][month].unshift(project)
          }
        }

      }

      return projects
    },

    update_position() {
      for (let project of this.ongoing) {
        project.link.position = this.ongoing.indexOf(project)
      }
    },

    create_project() {
      this.create_dialog = false

      console.log(this.new_project_name)
      console.log(this.new_project_date)

      this.new_project_name = ''
      this.new_project_date = ''
    },

    get_route(project_id) {
      if (this.$current_view == 'projects') {
        return `/team/${this.$current_team_id}/draft/${this.$current_app_id}/project/${project_id}`
      }
      
      else if (this.$current_view == 'myapexprojects') {
        return `/myapex/draft/${this.$current_app_id}/project/${project_id}`
      }
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.projects-ongoing-project {
  display: flex;
  cursor: pointer;
  align-items: center;
  height: 56px;
  padding: 0 10px 0 5px;
  color: black;
  text-decoration: none;
  transition: background-color .2s;
}

.projects-ongoing-project:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

</style>
