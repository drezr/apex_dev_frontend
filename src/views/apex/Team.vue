<template>

<div class="team-frame">
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title my-9">
        {{ team.name }}

        <CustomButton
          v-if="$has_xs(['is_manager'])"
          @click="access_manager_dialog = true"
          :tooltip="lang.views.team.access_manager_tooltip[lg]"
          :icon="'mdi-account-group-outline'"
          :color="'teal'"
          :text_color="'white'"
          class="ml-3"
        ></CustomButton>
      </div>

      <div class="tiles-frame">
        <Tile
          v-for="app in team.apps"
          :key="app.id"
          :self="app"
          class="ma-3"
        />
      </div>
    </div>
  </transition>


  <v-dialog v-model="access_manager_dialog" max-width="600">
    <AccessManager :team="team" />
  </v-dialog>
</div>

</template>


<script>

import AccessManager from '@/views/apex/components/AccessManager.vue'
import Tile from '@/views/apex/components/Tile.vue'

export default {
  name: 'TeamView',

  components: {
    AccessManager,
    Tile,
  },

  props: {
    
  },

  data() {
    return {
      team: Object(),
      resquest: null,
      loading: true,
      access_manager_dialog: false,
    }
  },

  async created() {
    this.request = await this.$http.get('team', {
      'team_id': this.$current_team_id,
    })

    this.team = this.request.team

    this.team.apps.sort((a, b) => {
      a = a.name || ''
      b = b.name || ''
      
      return a.localeCompare(b)
    })

    this.team.apps.sort((a, b) => (a.app).localeCompare(b.app))

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

.team-frame {

}

.tiles-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 100%;
}

</style>
