<template>

<v-badge
  class="team-tile-badge"
  :value="self.app == 'radium'"
  :color="self.message_count == 0 ? 'blue' : 'red'"
  :content="String(self.message_count)"
  overlap
  top
  right
  bordered
  offset-x="25"
  offset-y="25"
>
<v-card 
  class="block hover"
  :class="$app_descriptions[self.app].color"
  :to="path"
  width="300"
  height="300"
  min-width="300"
  min-height="300"
>
  <v-card-title class="white--text text-h4">
    {{ $app_descriptions[self.app].title }}
    <span v-if="self.name" class="ml-3 text-h6">({{ self.name }})</span>
  </v-card-title>

  <v-card-subtitle class="white--text">
    {{ $app_descriptions[self.app].desc }}
  </v-card-subtitle>

  <v-img :src="logo" class="logo" />
</v-card>
</v-badge>

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
        if (this.$current_view == 'team') {
          return `/team/${this.self.team}/${this.self.app}/${this.self.id}/projects`
        }
        
        else if (this.$current_view == 'myapex') {
          return `/myapex/${this.self.app}/${this.self.id}/projects`
        }
      }

      else if (this.self.app == 'planner') {
        return `/team/${this.self.team}/${this.self.app}/${this.self.id}/board/month/${month}/year/${year}`
      }

      else if (this.self.app == 'nexus') {
        return `/myapex/${this.self.app}/${this.self.id}/contacts/day/${this.$current_day}/month/${this.$current_month}/year/${this.$current_year}`
      }

      return `/team/${this.self.team}/${this.self.app}/${this.self.id}`
    },
  },

  methods: {

  },

  watch: {

  }
}

</script>

<style>

.team-tile-badge .v-badge__badge {
  height: 30px;
  min-width: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

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