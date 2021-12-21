<template>

<div class="d-flex">
  <div
    v-for="(field, column_name) in config"
    :key="column_name"
    class="work-row-field"
    :style="`width: ${config[column_name]['width']};`"
  >
    <textarea
      v-model="self.extend[column_name]"
      @input="parent_cpnt.set_textarea_height($event, column, 5)"
      :style="parent_cpnt.get_textarea_style(column, 5)"
      class="work-textarea no-focus"
      style="width: 100%; margin-top: 2px;"
    ></textarea>
  </div>
</div>

</template>


<script>

export default {
  name: 'FieldTable',

  components: {
    
  },

  props: {
    self: Object,
    column: Object,
    parent_cpnt: Object,
    edit_mode: Boolean,
    config: Object(),
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

  }
}

</script>


<style scoped>


</style>
