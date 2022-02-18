<template>

<div class="d-flex flex-column align-center">

  <TimeTravel class="works-mobile-timetravel my-3" />

  <div
    v-for="(part, i) in parts"
    :key="i"
    style="width: 100%; max-width: 500px;"
  >
    <Part
      :self="part"
      class="my-3 px-1"
      style="width: 100%; max-width: 500px;"
    />
  </div>

</div>

</template>


<script>

import TimeTravel from '@/components/TimeTravel.vue'
import Part from '@/components/Part.vue'

export default {
  name: 'WorksMobile',

  components: {
    TimeTravel,
    Part,
  },

  props: {
    
  },

  data() {
    return {
      parts: Array(),
    }
  },

  async created() {
    let request = await this.$http.get('worksmobile', {
      'profile_id': this.$logged_profile.id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.parts = request.parts
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

.works-mobile-timetravel {
  max-width: 350px;
}

</style>
