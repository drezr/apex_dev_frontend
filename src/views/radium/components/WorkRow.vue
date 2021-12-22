<template>

<div class="d-flex">
  <div
    v-for="(field, column_name) in config"
    :key="column_name"
    class="work-row-field"
    :style="`width: ${config[column_name]['width']};`"
  >
    <textarea
      v-model="self[column_name]"
      @input="parent_cpnt.set_textarea_height($event, column_config, 5)"
      :style="parent_cpnt.get_textarea_style(column_config, 5)"
      class="work-textarea no-focus"
      :class="parent.text_color ? parent.text_color + '--text' : ''"
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
    column_config: Object,
    parent: Object,
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
