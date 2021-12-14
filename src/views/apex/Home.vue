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

      <v-card
        class="mx-auto my-6"
        max-width="600"
        v-if="circles.length > 0"
      >
        <v-toolbar color="teal" dark>
          <v-toolbar-title>
            {{ circles.length > 1 ? lang.views.home.my_circles[lg] : lang.views.home.my_circle[lg] }}
          </v-toolbar-title>
        </v-toolbar>

        <v-list>
          <v-list-group
            v-for="(circle, i) in circles"
            :key="i"
            :value="i == 0 ? circles.length == 1 ? true : false : false"
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

  <div class="d-flex justify-end">
    <v-tooltip
      :top="true"
      color="black"
    >
      <template v-slot:activator="{ on: show_tooltip }">
        <div class="home-my-apex" v-on="show_tooltip">
          <router-link :to="'/myapex'">
            <img :src="$tool.get_logo('myapex_50x50')" class="logo" />
          </router-link>
        </div>
      </template>

      <span>My Apex</span>
    </v-tooltip>
  </div>
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

.home-my-apex {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  height: 60px;
  padding: 5px;
  border-radius: 200px;
  transition: filter .5s, box-shadow .5s;
  cursor: pointer;
}

.home-my-apex:hover {
  filter: brightness(1.1) contrast(1.2);
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1);
}

</style>
