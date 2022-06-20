<template>

<div>
  <v-card :color="self.color" dark class="py-1 px-3 mb-1">
    {{ lang.views.radium.messages_work_date[lg] }}
    {{ self.shifts.length > 0 ? $tool.format_date(self.shifts[0].date) : '---' }}
  </v-card>

  <v-card
    :color="self.color + ' lighten-4'"
    class="d-flex pa-2 align-center"
  >
    <img :src="$tool.get_logo('radium_50x50')" class="mr-6" />

    <div class="work-simple-description">
      {{ description }}
    </div>
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
    description() {
      let desc = this.self.work_columns.find(f => f.name == 'description')

      return !desc ? '' : desc.value
    }
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

.work-simple-description {
  font-size: 16px;
  white-space: pre-line;
  padding: 2px;
  flex-grow: 1;
}

</style>
