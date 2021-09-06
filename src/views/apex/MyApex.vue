<template>

<div class="team-frame">
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title my-9">
        {{ $logged_profile.name }}
      </div>

      <div class="tiles-frame">
        <Tile
          v-for="app in apps"
          :key="app.id"
          :self="app"
          class="ma-3"
        />
      </div>
    </div>
  </transition>
</div>

</template>


<script>

import Tile from '@/views/apex/components/Tile.vue'

export default {
  name: 'TeamView',

  components: {
    Tile,
  },

  props: {
    
  },

  data() {
    return {
      apps: Object(),
      resquest: null,
      loading: true,
    }
  },

  async created() {
    this.request = await this.$http.get('myapex', {})

    this.apps = this.request.profile.apps

    this.apps.sort((a, b) => {
      a = a.name || ''
      b = b.name || ''
      
      return a.localeCompare(b)
    })

    this.apps.sort((a, b) => (a.app).localeCompare(b.app))

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
