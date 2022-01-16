<template>

<div
  class="d-flex lighten-4"
  :class="parent_cpnt.edit_mode ? '' : self.bg_color"
  @click="set_color()"
>
  <div
    v-for="(field, column_name) in config"
    :key="column_name"
    class="work-row-field d-flex align-center"
    :style="`width: ${config[column_name]['width']};`"
  >
    <textarea
      v-model="self[column_name]"
      @input="parent_cpnt.set_textarea_height($event, column_config, 5)"
      :style="get_textarea_style(column_config, 5, self[column_name], (column_name + self.id))"
      class="work-textarea no-focus text--accent-4 hide-scrollbar"
      :class="text_color"
      style="width: 100%;"
      :disabled="!parent_cpnt.edit_mode"
      :ref="column_name + self.id"
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
    text_color() {
      if (this.self.text_color) {
        return this.self.text_color + '--text'
      }

      else if (this.parent.text_color) {
        return this.parent.text_color + '--text'
      }
      
      return ''
    },
  },

  methods: {
    set_color() {
      let cc = this.$current_component

      if (cc.palette && cc.palette_mode == 'rows_bg') {
        this.self.bg_color = cc.palette_color

        this.$emit('update')
      }

      if (cc.palette && cc.palette_mode == 'rows_text') {
        this.self.text_color = cc.palette_color

        this.$emit('update')
      }
    },

    get_textarea_style(column, extra_height, value, uid) {
      setTimeout(() => {
        if (this.$refs[uid]) {
          let textarea = this.$refs[uid][0]
          textarea.style.height = `10px`
          textarea.style.height = `${textarea.scrollHeight}px`
          textarea.style.paddingTop = `${extra_height}px`
          textarea.style.paddingBottom = `${extra_height}px`
          textarea.style.fontSize = `${column.textsize}px`

          setTimeout(() => {
            textarea.style.height = `${textarea.scrollHeight}px`
          }, 1)
        }
      }, 1)
    },
  },

  watch: {

  }
}

</script>


<style scoped>


</style>
