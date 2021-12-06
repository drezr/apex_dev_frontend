<template>

<v-badge
  :value="badge"
  :color="badge_color"
  :icon="badge_icon"
  :content="badge_content"
  :dot="badge_dot"
  overlap top right 
  :offset-x="badge_offset_x"
  :offset-y="badge_offset_y"
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
              (width ? `width: ${width}px; min-width: 0px; ` : ' ') +
              (cursor ? `cursor: ${cursor}; ` : ' ') +
              (height ? `height: ${height}px; ` : ' ') +
              (padding_x || padding_x == 0 ? `padding-left: ${padding_x}px; padding-right: ${padding_x}px;` : ' ') + 
              (padding_y || padding_y == 0 ? `padding-top: ${padding_y}px; padding-bottom: ${padding_y}px;` : ' ') 
            "
            :disabled="disabled"
            :outlined="outlined"
            :dark="dark"
            :block="block"
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
            <Loader
              :size="18"
              :width="3"
              :color="'white'"
              v-if="loading"
            />

            <div v-else>
              <v-icon
                :x-small="xsmall"
                :small="small"
                :large="large"
                :x-large="xlarge"
              >
                {{ icon }}
              </v-icon>
            </div>

            <span v-if="text" :class="padding_x || padding_x == 0 ? '' : 'ml-2'">
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
        <v-list-item-icon v-if="menu.icon" class="mr-6">
          <v-icon :class="menu.color + '--text'">{{ menu.icon }}</v-icon>
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

    padding_x: Number,
    padding_y: Number,

    badge: Boolean,
    badge_color: String,
    badge_content: String,
    badge_icon: String,
    badge_dot: Boolean,
    badge_offset_x: {
      type: Number,
      default: 0,
    },
    badge_offset_y: {
      type: Number,
      default: 0,
    },

    menus: {
      type: Array,
      default: () => { return Array() },

/*    
      Template

      {
        'icon': 'mdi-icon',
        'name': 'name',
        'color': 'color',
        'action': 'action',
      },
*/

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
    block: Boolean,
    fab: Boolean,
    small_fab: Boolean,

    xsmall: Boolean,
    small: Boolean,
    large: Boolean,
    xlarge: Boolean,
    height: Number,
    width: Number,

    elevation: Number,

    loading: Boolean,
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
