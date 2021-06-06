<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <v-card
        class="mx-auto mt-16"
        max-width="600"
        v-if="user_teams.length > 0"
      >
        <v-toolbar color="blue" dark>
          <v-toolbar-title>
            {{ user_teams.length > 1 ? lang.views.home.my_teams[lg] : lang.views.home.my_team[lg] }}
          </v-toolbar-title>
        </v-toolbar>

        <v-list>
          <v-list-item
            v-for="team in user_teams"
            :key="team.name"
            :to="`/team/${team.id}`"
            link
            class="pl-6"
          >
            <v-list-item-icon>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="team.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card class="mx-auto my-6" max-width="600">
        <v-toolbar color="teal" dark>
          <v-toolbar-title>{{ lang.views.home.circles[lg] }}</v-toolbar-title>
        </v-toolbar>

        <v-list>
          <v-list-group
            v-for="circle in circles"
            :key="circle.name"
            :value="false"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="circle.name"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="team in circle.teams"
              :key="team.name"
              :to="`/team/${team.id}`"
              link
              class="pl-6"
            >
              <v-list-item-icon>
                <v-icon>mdi-chevron-right</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="team.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </div>
  </transition>
</div>

</template>


<script>

export default {
  name: 'HomeView',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      user_teams: Array(),
      circles: Array(),
      resquest: null,
    }
  },

  async created() {
    this.request = await this.$http.get('home')

    this.user_teams = this.request.user_teams
    this.circles = this.request.circles

    this.user_teams.sort((a, b) => (a.name).localeCompare(b.name))
    this.circles.sort((a, b) => (a.name).localeCompare(b.name))

    for (let circle of this.circles) {
      circle.teams.sort((a, b) => (a.name).localeCompare(b.name))
    }

    this.loading = false
  },

  computed: {

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
