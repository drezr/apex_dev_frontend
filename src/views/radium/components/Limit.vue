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
  name: 'Limit',

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
          'width': '6%',
        },
        'from_station': {
          'name' : this.lang.views.radium.station[this.lg],
          'width': '18%',
        },
        'from_lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '5%',
        },
        'from_signal': {
          'name' : this.lang.views.radium.signal[this.lg],
          'width': '13%',
        },
        'from_pk': {
          'name' : this.lang.views.radium.pk[this.lg],
          'width': '8%',
        },
        'to_line': {
          'name' : this.lang.views.radium.line[this.lg],
          'width': '6%',
        },
        'to_station': {
          'name' : this.lang.views.radium.station[this.lg],
          'width': '18%',
        },
        'to_lane': {
          'name' : this.lang.views.radium.lane[this.lg],
          'width': '5%',
        },
        'to_signal': {
          'name' : this.lang.views.radium.signal[this.lg],
          'width': '13%',
        },
        'to_pk': {
          'name' : this.lang.views.radium.pk[this.lg],
          'width': '8%',
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
