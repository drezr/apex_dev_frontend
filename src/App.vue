<template>

<v-app>
  <div class="main-frame">

  </div>
</v-app>

</template>


<script>

// import Component from '@/components/Component.vue'

export default {
  name: 'App',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {

    }
  },

  async created() {
    let token = await this.$http.post(`api-token-auth`, {
      'username': 'ronan.dumont@infrabel.be',
      'password': 'x',
    })

    this.$http.header = {Authorization: 'Token ' + token.token}

    let result = await this.$http.get('works', {
      'team_id': 1,
      'app_id': 3,
      'month': 5,
      'year': 2021,
    })

    console.log(result)
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

.main-frame {
  display: block !important;
  max-width: 100% !important;
  min-width: 100% !important;
  max-height: 100% !important;
  min-height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

</style>
