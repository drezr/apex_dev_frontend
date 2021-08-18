<template>

<v-card 
  class="block hover"
  :class="details[self.app].color"
  :to="path"
  width="300"
  height="300"
  min-width="300"
  min-height="300"
>
  <v-card-title class="white--text text-h4">
    {{ details[self.app].title }}
    <span v-if="self.name" class="ml-3 text-h6">({{ self.name }})</span>
  </v-card-title>

  <v-card-subtitle class="white--text">
    {{ details[self.app].desc }}
  </v-card-subtitle>

  <v-img :src="logo" class="logo" />
</v-card>

</template>


<script>

export default {
  name: 'Tile',

  components: {
    
  },

  props: {
    self: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {

    }
  },

  async created() {

  },

  mounted() {
    
  },

  computed: {
    logo() {
      return require('@/assets/logos/' + this.self.app + '_1000x1000.png')
    },

    path() {
      let date = new Date()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      if (this.self.app == 'watcher') {
        return `/team/${this.self.team}/${this.self.app}/${this.self.id}/calendar/month/${month}/year/${year}`
      }

      else if (this.self.app == 'radium') {
        return `/team/${this.self.team}/${this.self.app}/${this.self.id}/works/month/${month}/year/${year}`
      }

      else if (this.self.app == 'draft') {
        return `/team/${this.self.team}/${this.self.app}/${this.self.id}/projects`
      }

      else if (this.self.app == 'planner') {
        return `/team/${this.self.team}/${this.self.app}/${this.self.id}/board/month/${month}/year/${year}`
      }

      return `/team/${this.self.team}/${this.self.app}/${this.self.id}`
    },

    details() {
      return {
        'draft': {
          title: 'Draft',
          desc: this.lang.views.team.draft_desc[this.lg],
          color: 'deep-purple',
        },
        'fleet': {
          title: 'Fleet',
          desc: this.lang.views.team.fleet_desc[this.lg],
          color: 'purple darken-1',
        },
        'planner': {
          title: 'Planner',
          desc: this.lang.views.team.planner_desc[this.lg],
          color: 'deep-orange accent-3',
        },
        'radium': {
          title: 'Radium',
          desc: this.lang.views.team.radium_desc[this.lg],
          color: 'indigo',
        },
        'watcher': {
          title: 'Watcher',
          desc: this.lang.views.team.watcher_desc[this.lg],
          color: 'blue',
        },
      }
    }
  },

  methods: {

  },

  watch: {

  }
}

</script>

<style>

</style>


<style scoped>

.hover {
  transition: .15s;
  overflow: hidden;
}

.hover:hover {
  filter: contrast(1.5);
}

.logo {
  position: relative;
  top: -15px;
  left: 25px;
  opacity: 0.8;
}

</style>