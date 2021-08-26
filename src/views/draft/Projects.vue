<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title">
        {{ team.name }}
      </div>

      <v-card class="mx-auto mb-10" max-width="600">
        <v-toolbar color="deep-purple" class="elevation-1" dark>
          <v-toolbar-title>
            <v-icon x-large class="mr-3">mdi-cogs</v-icon>
            Projets en cours
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-toolbar>
<!-- 
        <v-list>
          <v-list-item v-if="ongoing.length == 0">
            <v-list-item-content class="d-flex justify-center py-5 text-center">
              Il n'y a pas de projet en cours.<br>
              Créez-en un nouveau en cliquant sur le bouton « + ».
            </v-list-item-content>
          </v-list-item>

          <draggable
            v-model="self.children"
            @change="update_position"
            :animation="100"
            easing="cubic-bezier(1, 0, 0, 1)"
            :disabled="!can_drag"
          >
            <v-list-item
              v-for="project in ongoing"
              :key="project.id"
              :to="`/draft/${$current_circle}/project/${project.id}/`"
              class="pl-6"
              link
            >
              <v-list-item-icon>
                <v-icon>mdi-clipboard-check-multiple-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                {{ project.name }}
              </v-list-item-content>

              <v-chip class="ml-1 white--text grey darken-3" small>
                {{ format_date(`${project.year}-${project.month}-${project.day}`) }}
              </v-chip>
            </v-list-item>
          </draggable>
        </v-list> -->

        {{archived}}
      </v-card>
    </div>
  </transition>
</div>

</template>


<script>

// import Component from '@/components/Component.vue'

export default {
  name: 'Projects',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      loading: true
    }
  },

  async created() {
    this.request = await this.$http.get('draft', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
    })

    this.team = this.request.team
    this.profiles = this.request.team.profiles
    this.app = this.request.app

    this.loading = false
  },

  computed: {
    ongoing() {
      let ongoing = this.app.projects.filter(p => !p.archived)

      if (!this.$xs.draft_can_see_private) {
        ongoing = ongoing.filter(p => !p.private)
      }

      return ongoing
    },

    archived() {
      let archived = this.app.projects.filter(p => p.archived)
      let projects = Object()
      let csp = this.$xs.draft_can_see_private

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
  },

  methods: {

  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

</style>
