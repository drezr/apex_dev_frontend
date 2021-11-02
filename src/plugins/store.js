import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged_profile: null,
    copied_unit: null,
    linked_unit: null,
    moved_unit: null,
    can_drag: false,
    palette_toggled: false,
    palette_color: 'red accent-4',
    is_grabbing: false,
  },

  mutations: {
    set_logged_profile(state, profile) {
      state.logged_profile = profile
    },

    set_copied_unit(state, unit) {
      state.copied_unit = unit
    },

    set_linked_unit(state, unit) {
      state.linked_unit = unit
    },

    set_moved_unit(state, unit) {
      state.moved_unit = unit
    },

    toggle_palette(state, toggled) {
      state.palette_toggled = toggled
    },

    toggle_can_drag(state) {
      state.can_drag = !state.can_drag
    },

    set_palette_color(state, color) {
      state.palette_color = color
    },

    set_is_grabbing(state, is_grabbing) {
      state.is_grabbing = is_grabbing
    },
  },

  actions: {

  },

  modules: {

  }
})
