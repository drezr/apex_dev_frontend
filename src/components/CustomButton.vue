<template>

<v-badge
  :value="badge"
  :color="badge_color"
  :icon="badge_icon"
  :content="badge_content"
  :dot="badge_dot"
  overlap top right 
>
  <v-menu
    ref="menu" 
    v-model="show_menu"
    :nudge-bottom="menu_top ? -35 : 35"
    :top="menu_top"
    :disabled="menus.length == 0"
  >
    <template v-slot:activator="{ on: show_menu }">
      <v-tooltip
        :bottom="tooltip_bottom"
        :top="tooltip_top"
        color="black"
        :disabled="tooltip.length == 0 || !breakpoint"
      >
        <template v-slot:activator="{ on: show_tooltip }">
          <v-btn
            @click="$emit('click')"
            @mousedown="$emit('mousedown')"
            @mouseup="$emit('mouseup')"
            @mouseover="$emit('mouseover')"
            @mouseenter="$emit('mouseenter')"
            @mouseleave="$emit('mouseleave')"
            :color="color"
            :class="[text_color ? text_color + '--text' : '']"
            :style="
              cursor ? ` cursor: ${cursor}; ` : '' +
              height ? ` height: ${height}px; ` : ''
            "
            :disabled="disabled"
            :outlined="outlined"
            :dark="dark"
            :rounded="rounded"
            :fab="fab"
            :icon="small_fab"
            :x-small="xsmall"
            :small="small"
            :large="large"
            :x-large="xlarge"
            :elevation="elevation"
            v-on="{ ...show_tooltip, ...show_menu }"
          >
            <v-icon
              :x-small="xsmall"
              :small="small"
              :large="large"
              :x-large="xlarge"
            >
              {{ icon }}
            </v-icon>

            <span v-if="text" class="ml-2">
              {{ text }}
            </span>
          </v-btn>
        </template>

        <span>{{ tooltip }}</span>
      </v-tooltip>
    </template>

    <v-list>
      <v-list-item
        @click="$emit('menu_action', menu.action)"
        v-for="(menu, i) in menus"
        :key="i"
        link
        :class="menu.name == menu_selected ? 'blue lighten-4' : ''"
      >
        <v-list-item-icon v-if="menu.icon" class="mr-3">
          <v-icon :color="menu.color">{{ menu.icon }}</v-icon>
        </v-list-item-icon>
          
        <v-list-item-title>
          <span :class="menu.color + '--text'">{{ menu.name }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</v-badge>

</template>


<script>

export default {
  name: 'CustomButton',

  components: {
    
  },

  props: {
    color: String,
    icon: String,

    badge: Boolean,
    badge_color: String,
    badge_content: String,
    badge_icon: String,
    badge_dot: Boolean,

    menus: {
      type: Array,
      default: () => { return Array() },
    },
    menu_top: Boolean,
    menu_selected: String,

    tooltip: {
      type: String,
      default: '',
    },
    tooltip_top: Boolean,

    text: String,
    text_color: String,

    cursor: String,
    disabled: Boolean,
    outlined: Boolean,
    rounded: Boolean,
    dark: Boolean,
    fab: Boolean,
    small_fab: Boolean,

    xsmall: Boolean,
    small: Boolean,
    large: Boolean,
    xlarge: Boolean,
    height: Number,

    elevation: Number,
  },

  data() {
    return {
      show_menu: false,
    }
  },

  created() {

  },

  computed: {
    tooltip_bottom() {
      return this.tooltip_top ? false : true
    },

    breakpoint() {
      return this.$vuetify.breakpoint.smAndUp
    },
  },

  methods: {

  },

  watch: {

  }
}

</script>


<style>

</style>


<style scoped>

</style>
