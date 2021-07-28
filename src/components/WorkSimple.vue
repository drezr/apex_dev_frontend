<template>

<div>
  <v-card :color="self.color" dark class="py-1 px-3 mb-1">
    {{ lang.views.radium.messages_work_date[lg] }}
    {{ $tool.format_date(self.date) }}
  </v-card>

  <v-card :color="self.color + ' lighten-4'" class="pa-4">
    <big>{{ self.description }}</big>
  </v-card>
</div>

</template>


<script>

export default {
  name: 'WorkSimple',

  components: {
    
  },

  props: {
    self: Object,
  },

  data() {
    return {

    }
  },

  created() {

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


</style>
