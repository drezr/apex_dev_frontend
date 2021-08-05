<template>

<div class="team-frame">
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title my-9">
        {{ self.name }}

        <CustomButton
          v-if="$xs.is_manager || $is_staff"
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
          v-for="app in self.apps"
          :key="app.id"
          :self="app"
          class="ma-3"
        />
      </div>
    </div>
  </transition>


  <v-dialog v-model="access_manager_dialog" max-width="600">
    <AccessManager :team="self" />
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
      self: Object(),
      resquest: null,
      loading: true,
      access_manager_dialog: false,
    }
  },

  async created() {
    this.request = await this.$http.get('team', {
      'team_id': this.$current_team_id,
    })

    this.self = this.request.team

    this.self.apps.sort((a, b) => {
      a = a.name || ''
      b = b.name || ''
      
      return a.localeCompare(b)
    })

    this.self.apps.sort((a, b) => (a.app).localeCompare(b.app))

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
