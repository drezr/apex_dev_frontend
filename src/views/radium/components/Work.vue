<template>

<div class="work-overframe">
  <div class="work-frame lighten-5" :class="self.color">
    <div
      v-for="(column, i) in $parent.columns"
      :key="i"
      class="work-column"
      :style="`min-width: ${column.width}px;`"
    >
      <div class="work-column-title">
        <div
          v-if="i == 0"
          class="work-drag-button pink"
          :style="`cursor: ${grab_cursor};`"
          @mousedown="grab_cursor = 'grabbing'"
          @mouseup="grab_cursor = 'grab'"
          @mouseleave="grab_cursor = 'grab'"
        >
          <v-icon size="16" color="white">mdi-arrow-split-horizontal</v-icon>
        </div>

        {{ lang.views.radium['column_title_' + column.name][lg] }}
      </div>

      <div
        class="work-column-value"
        :class="[
          edit_mode ? 'white' : (self[column.name + '_bg_color'] ? self[column.name + '_bg_color'] : self.color),
          edit_mode ? '' : (self[column.name + '_bg_color'] ? 'lighten-2' : (self[column.name] && self[column.name].length > 0 ? 'lighten-3' : 'lighten-4')),
        ]"
      >
        <v-textarea
          v-if="!Array.isArray(self[column.name]) && column.name in self"
          v-model="self[column.name]"
          :rows="1"
          auto-grow
          outlined
          hide-details
          class="work-field"
          :style="`font-size: ${column.textsize}px; width: ${column.width - 1}px;`"
          :disabled="!edit_mode"
          :background-color="edit_mode ? 'white' : 'transparent'"
        />
      </div>
    </div>
  </div>
</div>

</template>


<script>

export default {
  name: 'Work',

  components: {
    
  },

  props: {
    self: Object,
  },

  data() {
    return {
      edit_mode: true,
      grab_cursor: 'grab',
    }
  },

  created() {
    //console.log(this.self)
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

.work-field textarea:disabled {
  color: black !important;
}

.work-field textarea {
  margin-top: 10px !important;
  margin-bottom: 5px !important;
  text-align: center;
}

.work-field .v-text-field--filled>.v-input__control>.v-input__slot, .v-text-field--full-width>.v-input__control>.v-input__slot, .v-text-field--outlined>.v-input__control>.v-input__slot {
  min-height: 0px !important;
}

.work-field.v-text-field--outlined fieldset {
  border: none !important;
}

.work-field .v-text-field .v-input__control, .v-text-field .v-input__slot, .v-text-field fieldset {
  border-radius: 0px !important;
}

</style>


<style scoped>

.work-overframe {
  border: 1px black solid;
  min-width: min-content;
  border-radius: 10px;
  overflow: hidden;
}

.work-frame {
  display: flex;
  flex-wrap: nowrap;
  border: 1px black solid;
}

.work-column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.work-column:not(:first-child) {
  border-left: 1px grey solid;
}

.work-column-title {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px grey solid;
  position: relative;
}

.work-column-value {
  display: flex;
  align-items: center;
  flex-grow: 1;
  cursor: text;
}

.work-drag-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 10px;
}

</style>
