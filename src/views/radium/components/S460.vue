<template>

<div>
  <textarea
    v-for="(field, column_name) in field_config"
    :key="column_name"
    v-model="self.extend[column_name]"
    @input="parent_cpnt.set_textarea_height($event, column, 2)"
    :style="
      parent_cpnt.get_textarea_style(column, 2) +
      `width: ${field_config[column_name]['width']};`
    "
    class="work-textarea no-focus my-1"
  ></textarea>
</div>

</template>


<script>

export default {
  name: 'S460',

  components: {
    
  },

  props: {
    self: Object,
    column: Object,
    parent_cpnt: Object,
    edit_mode: Boolean,
  },

  data() {
    return {
    }
  },

  created() {

  },

  computed: {
    field_config() {
      return {
        'from_line': {
          'name' : this.lang.views.radium.line[this.lg],
          'width': '21%',
        },
        'from_lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '15%',
        },
        'from_pk': {
          'name' : this.lang.views.radium.from[this.lg],
          'width': '32%',
        },
        'to_pk': {
          'name' : this.lang.views.radium.to[this.lg],
          'width': '32%',
        },
      }
    },
  },

  methods: {

  },

  watch: {

  }
}

</script>


<style scoped>


</style>
