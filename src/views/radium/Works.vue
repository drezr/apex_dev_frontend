<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title">
        {{ team.name }}
      </div>

      <NavigationBar />

      <div class="works-frame">
        <Work
          v-for="(work, i) in works"
          :key="i"
          :self="work"
          class="ma-3"
        />
      </div>
    </div>
  </transition>

</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import Work from '@/views/radium/components/Work.vue'

export default {
  name: 'Works',

  components: {
    NavigationBar,
    Work,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
    }
  },

  async created() {
    this.request = await this.$http.get('works', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.config = this.request.config
    this.works = this.request.works

    this.loading = false
  },

  computed: {
    columns() {
      let columns = Array()

      for (let key in this.config) {
        for (let value of ['visible', 'width', 'position', 'textsize']) {
          if (key.includes(value)) {
            let name = key.replace('_' + value, '')
            let item = columns.find(i => i.name == name)

            if (!item) {
              item = {'name': name}
              columns.push(item)
            }

            item[value] = this.config[key]
            break
          }
        }
      }

      columns.sort((a, b) => a.position - b.position)

      return columns
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
