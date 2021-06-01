<template>

<v-app>
  <div class="main-frame">

    <CustomButton 
      :text="'Hello World !'"
      :color="'blue'"
      :dark="true"
    />

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

    let team_id = 1
    let app_id = 2
    let month = 5
    let year = 2021

    let works = await this.$http.get(
      `team/${team_id}/watcher/${app_id}/calendar/${month}/${year}`
    )

    console.log(works)

    let home = await this.$http.get(`home`)

    console.log(home)
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
