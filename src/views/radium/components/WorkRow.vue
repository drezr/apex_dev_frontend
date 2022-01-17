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
      :ref="column_name"
      v-model="self[column_name]"
      :style="get_textarea_style(column_name)"
      class="work-textarea no-focus text--accent-4 hide-scrollbar"
      :class="text_color"
      style="width: 100%; padding: 5px 0;"
      :disabled="!parent_cpnt.edit_mode"
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

    get_textarea_style(column_name) {
      this.$nextTick(() => {
        if (this.$refs[column_name]) {
          let textarea = this.$refs[column_name][0]

          if (textarea) {
            textarea.style.fontSize = `${this.column_config.textsize}px`
            textarea.style.height = `5px`
            textarea.style.height = `${textarea.scrollHeight}px`
          }
        }
      })
    },
  },

  watch: {
    column_config: {
      deep: true,

      handler() {
        for (let column_name in this.config) {
          this.get_textarea_style(column_name)
        }
      },
    }
  },
}

</script>


<style scoped>


</style>
