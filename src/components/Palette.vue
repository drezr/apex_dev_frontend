<template>

<div>
  <div class="d-flex justify-center">
    <div class="palette-frame">
      <div
        v-for="(color, i) in colors"
        :key="i"
        class="palette-color"
        :class="[
          color,
          $current_component.palette_color == color ? 'palette-color-selected' : ''
        ]"
        @click="$emit('pick-color', color)"
      ></div>
    </div>
  </div>

  <v-select
    v-if="$current_view == 'works'"
    v-model="$current_component.palette_mode"
    :items="color_mode"
    item-text="name"
    item-value="value"
    style="width: 400px;"
    class="mx-auto mt-3"
    hide-details
    outlined
  />
</div>

</template>


<script>

// import Component from '@/components/Component.vue'

export default {
  name: 'Palette',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      colors: [
        'red',
        'pink',
        'purple',
        'deep-purple',
        'indigo',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'brown',
        'blue-grey',
        'white',
      ],
    }
  },

  created() {

  },

  computed: {
    color_mode() {
      return [
        {
          'name': this.lang.views.radium.paint_works[this.lg],
          'value': 'works',
        },
        {
          'name': this.lang.views.radium.paint_columns[this.lg],
          'value': 'columns',
        },
      ]
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

.palette-frame {
  width: fit-content;
  border: 1px rgba(0, 0, 0, 0.4) solid;
  border-radius: 25px;
  display: flex;
  flex-wrap: wrap;
}

.palette-color {
  width: 40px;
  height: 40px;
  margin: 5px;
  border-radius: 20px;
  box-shadow: inset 0 0 3px 1px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.palette-color:hover {
  filter: brightness(1.3);
}

.palette-color-selected {
  box-shadow: inset 0 0 0 5px rgba(0, 0, 0, 0.6);
}

</style>
