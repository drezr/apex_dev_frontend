<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" style="padding-bottom: 20px;">
      <v-alert
        text
        color="info"
        type="info"
        outlined
        max-width="600"
        class="mx-auto mt-5"
        border="left"
      >
        <div @click="show_changelog = !show_changelog" style="cursor: pointer;">
          <b>Apex est à jour !</b> <small><i>(cliquez ici pour plus d'informations)</i></small>
          <v-icon class="float-right">
            {{ show_changelog ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </div>

        <div v-if="show_changelog" class="mt-5">
          Bonjour à tous,<br><br>

          Apex a reçu ce dimanche <b>23/01/2022</b> une mise à jour majeure.<br><br>

          Une brève vidéo de présentation vous permettra d'avoir un aperçu des changements et nouveautés :<br><br>

          <video controls controlslist width="100%">
            <source :src="$http.media + 'Apex - Présentation des nouveautés.mp4'" type="video/mp4">

            Sorry, your browser doesn't support embedded videos.
          </video><br><br>

          <v-alert
            text
            color="warning"
            outlined
            class="mx-auto mt-5"
            border="left"
          >
            Quelques informations importantes sont toutefois à noter :<br><br>

            <small>
              <ul>
                <li>La version mobile (<a href="https://mobile.apex.wf" target="_blank">mobile.apex.wf</a>) est hors service pour le moment mais reviendra très bientôt. Les utilisateurs de la version mobile seront redirigés vers la version ordinateur (<a href="https://apex.wf">apex.wf</a>) temporairement.</li>

                <li>Pour des raisons techniques, plusieurs données ne seront pas importées dans la nouvelle version mais sont toujours accessibles depuis <a href="https://old.apex.wf" target="_blank">old.apex.wf</a>. Ces données sont :</li>

                <ul>
                  <li>Le pointage Watcher de 2021</li>
                  <li>Les projets Draft</li>
                  <li>Les fichiers</li>
                </ul>
              </ul>
            </small>
          </v-alert>

          <br>
          Tous les chantiers Radium, le calendrier Watcher et la planification des tâches de 2022 ont été importés.<br><br>

          Gardez à l'esprit qu'Apex est un projet individuel et que son développeur (qui y travaille sur son temps libre) fait son maximum pour répondre aux besoins de chacun.<br><br>

          Bon travail !



          <div class="mt-5">
            <i><small>
              Apex est toujours en développement.<br>
              N'hésitez pas à poser vos questions, faire parvenir vos rapports de bugs et demandes d'améliorations à <b>ronan.dumont@infrabel.be</b>
            </small></i>
          </div>
        </div>
      </v-alert>


      <div class="mx-auto" style="max-width: 600px;">
        <v-card
          class="mt-5 mx-3"
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
          class="my-6 mx-3"
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
    </div>
  </transition>

<!--   <div class="d-flex justify-end">
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
  </div> -->
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
      show_changelog: false,
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
