<template>

<div>
  <div
    v-for="(column, i) in columns"
    :key="i"
    style="border-bottom: 1px black solid;"
  >
    <div>
      {{ column.name }}
    </div>

    <div v-if="column.multiple">
      <div v-if="column.name == 'shifts'">
        <Shift
          v-for="(shift, i) in self.shifts"
          :key="i"
          :self="shift"
          :parent="self"
          :column="column"
          :edit_mode="edit_mode"
        />
      </div>

      <div v-if="column.name == 'limits'">
        <Limit
          v-for="(limit, i) in self.columns.filter(c => c.name == 'limit')"
          :key="i"
          :self="limit"
          :column="column"
          :parent_cpnt="$current_instance"
          :edit_mode="edit_mode"
        />
      </div>

      <div v-if="column.name == 's460s'">
        <S460
          v-for="(s460, i) in self.columns.filter(c => c.name == 's460')"
          :key="i"
          :self="s460"
          :column="column"
          :parent_cpnt="$current_instance"
          :edit_mode="edit_mode"
        />
      </div>
    </div>

    <div v-else>
      <div>
        <textarea
          v-model="self.values[column.name].value"
          @input="set_textarea_height($event, column, 10)"
          :style="get_textarea_style(column, 10)"
          class="work-textarea"
        ></textarea>
      </div>
    </div>
  </div>
</div>


</template>


<script>

import Shift from '@/views/radium/components/Shift.vue'
import Limit from '@/views/radium/components/Limit.vue'
import S460 from '@/views/radium/components/S460.vue'

export default {
  name: 'Work',

  components: {
    Shift,
    Limit,
    S460,
  },

  props: {
    self: Object,
    parent_cpnt: Object,
  },

  data() {
    return {
      edit_mode: false,
      expanded: false,
      original_self: null,
      config: null,
    }
  },

  created() {
    if (this.self.newly_created) {
      this.edit_mode = true
      this.expanded = true
      this.self.newly_created = false
    }

    this.self.columns.sort((a, b) => a.position - b.position)
    this.original_self = this.$tool.deepcopy(this.self)

    this.self.values = this.get_values()



    console.log(this.self)
  },

  computed: {
    columns() {
      return this.$current_component.columns.filter(c => c.visible)
    },
  },

  methods: {
    get_values() {
      let values = Object()

      for (let column of this.columns.filter(c => !c.multiple)) {
        let existing_column = this.self.columns.find(c => c.name == column.name)

        if (existing_column) {
          values[column.name] = {
            'value': existing_column.value,
            'color': existing_column.color,
            'is_edited': existing_column.is_edited,
          }
        }

        else {
          values[column.name] = {
            'value': null,
            'color': null,
            'is_edited': false,
          }
        }
      }

      return values
    },

    set_textarea_height(event, column, extra_height) {
      event.target.style.height = `${Number(column.textsize) + extra_height}px `
      event.target.style.height = `${event.target.scrollHeight + 2}px `
    },

    get_textarea_style(column, extra_height) {
      return `font-size: ${column.textsize}px;
              height: ${Number(column.textsize) + extra_height}px; `
    },
  },

  watch: {

  },
}

</script>


<style>

.work-textarea {
  resize: none;
  text-align: center;
  outline: none;
}

.work-textarea:disabled {
  color: black;
}

</style>
