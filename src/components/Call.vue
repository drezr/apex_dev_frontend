<template>
 
<div class="call-frame">
  <div class="indigo lighten-4 d-flex">
    <v-icon class="mx-2" color="indigo">mdi-hammer-screwdriver</v-icon>

    <input
      class="call-input call-name indigo lighten-4"
      v-model="self.name"
      :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
    />
  </div>

  <input
    class="call-input call-kind"
    v-model="self.kind"
    :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
  />

  <div class="d-flex">
    <input
      class="call-input call-hour"
      v-model="self.start"
      :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
    />

    <input
      class="call-input call-hour"
      v-model="self.end"
      :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
    />

    <div class="call-calc">
      {{ hour_calc_default }}
    </div>

    <div class="call-calc">
      {{ hour_calc_decimal }}
    </div>
  </div>

  <v-textarea
    v-model="self.description"
    class="call-description pa-1"
    :rows="1"
    auto-grow
    hide-details
    solo
    :disabled="!(edit_mode && $has_xs(['watcher_is_editor']))"
    :flat="!(edit_mode && $has_xs(['watcher_is_editor']))"
    background-color="white"
    @input="update"
    :placeholder="lang.views.watcher.call_description[lg]"
  ></v-textarea>

  <div class="call-commands">
    <div v-if="edit_mode">
      <CustomButton
        :text="'D27'"
        :icon="'mdi-upload'"
        :color="'blue'"
        :dark="true"
        :tooltip="lang.views.watcher.call_send_d27[lg]"
        class="mx-1 mb-1"
      />

      <CustomButton
        :text="'D27'"
        :icon="'mdi-link'"
        :color="'blue'"
        :dark="true"
        :tooltip="lang.views.watcher.call_link_d27[lg]"
        class="mx-1 mb-1"
      />
    </div>

    <div v-if="edit_mode" class="mx-2 d-flex align-center">
      <CustomButton
        :icon="'mdi-arrow-split-horizontal'"
        :small_fab="true"
        :text_color="'pink'"
        :tooltip="lang.generic.update_position[lg]"
        :cursor="grab_cursor"
        @mousedown="grab_cursor = 'grabbing'"
        @mouseup="grab_cursor = 'grab'"
        @mouseleave="grab_cursor = 'grab'"
        class="handle"
      />

      <CustomButton
        :icon="'mdi-cog'"
        :small_fab="true"
        :text_color="'teal'"
        :tooltip="lang.generic.edit_options[lg]"
        :menus="edit_menus"
        @menu_action="menu_action($event)"
      />
    </div>
  </div>
</div>

</template>


<script>

export default {
  name: 'Call',

  components: {

  },

  props: {
    self: Object,
    parent: Object,
  },

  data() {
    return {
      grab_cursor: 'grab',
    }
  },

  created() {

  },

  mounted() {
    
  },

  beforeDestroy() {

  },

  computed: {
    edit_mode() {
      return this.$current_component.detail_edit_mode
    },

    hour_calc_decimal() {
      let [start_hour, start_minute] = this.get_splitted_hour(this.self.start)
      let [end_hour, end_minute] = this.get_splitted_hour(this.self.end)

      if (start_hour != null && start_minute != null && end_hour != null && end_minute != null) {
        let start_date = new Date()
        start_date.setHours(start_hour, start_minute, 0, 0)

        let end_date = new Date()
        end_date.setHours(end_hour, end_minute, 0, 0)

        let result = (end_date - start_date) / 1000 / 60 / 60

        if (result < 0) result = 24 + result

        result = Math.round(result * 100) / 100

        if (isNaN(result)) return '?'

        return '+' + result
      }

      return '?'
    },

    hour_calc_default() {
      let decimal = parseFloat(this.hour_calc_decimal.substring(1))

      if (isNaN(decimal)) return '?'

      let hour = Math.floor(decimal)
      let minute = Math.round(((decimal - hour) * 100) / 100 * 60)

      if (minute == 0) minute = ''

      return hour + 'h' + minute
    },

    edit_menus() {
      let delete_icon = this.self.link.is_original ? 'mdi-delete' : 'mdi-link-variant-remove'

      return [
        {
          'icon': 'mdi-content-copy',
          'name': this.lang.generic.to_copy[this.lg],
          'color': 'indigo',
          'action': 'copy',
        },
        {
          'icon': 'mdi-flip-to-front',
          'name': this.lang.generic.move[this.lg],
          'color': 'light-blue',
          'action': 'move',
        },
        {
          'icon': delete_icon,
          'name': this.lang.generic.delete[this.lg],
          'color': 'red',
          'action': 'delete',
        },
      ]
    },
  },

  methods: {
    update() {

    },

    get_splitted_hour(time) {
      if (time) {
        let hour, minute

        if (time.includes(':')) {
          [hour, minute] = time.split(':')
        }

        else if (time.toLowerCase().includes('h')) {
          [hour, minute] = time.toLowerCase().split('h')
        }

        return [parseInt(hour), parseInt(minute)]
      }

      return [null, null]
    },
  },

  watch: {

  },
}

</script>


<style>

.call-description textarea:disabled {
  color: black !important;
}

.call-input:disabled {
  color: black !important;
}

</style>


<style scoped>

.call-frame {
  border-radius: 5px;
  border: 1px grey solid;
}

.call-name {
  border-radius: 5px 5px 0 0;
  width: 100%;
  font-size: 15px;
  font-weight: bold;
  padding: 5px 5px;
}

.call-kind {
  border-radius: 5px 5px 0 0;
  width: 100%;
  font-size: 14px;
  padding: 2px 5px;
  border-bottom: 1px grey solid;
  text-align: center;
  font-weight: bold;
}

.call-hour {
  border: 1px grey solid;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  margin: 3px;
  width: 30%;
  font-weight: bold;
}

.call-calc {
  border: 1px rgba(0, 0, 0, 0.3) solid;
  background-color: rgba(0, 0, 0, 0.1);
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  margin: 3px;
  width: 20%;
  color: black;
}

.call-commands {
  display: flex;
  justify-content: space-between;
}

</style>
