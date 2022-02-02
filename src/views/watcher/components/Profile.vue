<template>

<router-link
  :is="$current_component.palette && $current_component.palette_mode == 'profile' ? 'span' : 'router-link'"
  :to="`/team/${$current_team_id}/watcher/${$current_app_id}/quota/profile/${profile.id}/year/${$current_year}`"
  class="profile-frame lighten-4"
  :class="[
    color + ' lighten-4',
    color + '--text text--darken-4',
    (!$has_xs(['watcher_can_see_quotas']) && profile.id != $logged_profile.id) ? 'pointer-events-none' : '',
    $current_component.palette && $current_component.palette_mode == 'profile' ? 'cursor-fill' : '',
  ]"
  :style="border_color ? `box-shadow: inset 0px 0px 0px 3px ${hex_colors[border_color]};` : ''"
  @mouseover="hover = true"
  @mouseleave="hover = false"
  @click="try_set_color()"
>
  <div v-if="!quota_toggled" style="position: relative;">
    <div><b>{{ profile.name }}</b></div>

    <div class="profile-grade">
      {{ profile.grade }} {{ profile.field }}
    </div>
    <div>{{ profile.ident }}</div>
    <div>{{ profile.phone }}</div>

    <v-btn
      v-if="$current_view == 'calendar' && ($has_xs(['watcher_can_see_quotas']) || profile.id == $logged_profile.id)"
      @click.prevent="get_quota('month_' + (start ? 'start' : 'end'))"
      outlined
      class="profile-toggle"
    >
      <v-icon :class="color + '--text text--darken-4'">
        mdi-calendar-range
      </v-icon>
    </v-btn>
  </div>

  <div v-if="quota_toggled">
    <v-btn
      class="white--text lighten-2 elevation-0 refresh px-0"
      style="position: absolute; top: 1px; left: 152px; min-width: 25px;"
      @click.prevent="get_quota('year_end')"
      :color="color"
      x-small
    >
      <v-icon small>mdi-skip-next-outline</v-icon>
    </v-btn>

    <v-btn
      class="white--text lighten-2 elevation-0 refresh px-0"
      style="position: absolute; top: 1px; left: 179px; min-width: 25px;"
      @click.prevent="get_quota('month_' + (start ? 'start' : 'end'))"
      :color="color"
      x-small
    >
      <v-icon small>mdi-calendar-range</v-icon>
    </v-btn>

    <div><b>{{ profile.name }}</b></div>

    <table style="width: calc(100% + 10px);">
      <tr>
        <td
          class="leave text--darken-4"
          :class="[leave.color + '--text']"
          v-for="(leave, i) in leaves"
          :key="i"
        >
          <b>{{ leave.code.toUpperCase() }}</b>
        </td>
      </tr>

      <tr>
        <td class="value" v-for="(leave, i) in leaves" :key="i">
          <v-progress-circular
            size="15"
            color="blue"
            indeterminate
            v-if="quota_loading"
          ></v-progress-circular>

          <span v-if="!quota_loading">
            {{ quota[leave.code.toLowerCase()] }}
          </span>
        </td>
      </tr>
    </table>
  </div>
</router-link>

</template>


<script>

export default {
  name: 'Profile',

  components: {
    
  },

  props: {
    profile: Object,
    start: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      quota_loading: true,
      quota_toggled: false,
      quota: null,
      hover: false,
      hex_colors: {
        'white': '#FFFFFF',
        'red': '#D50000',
        'pink': '#E91E63',
        'purple': '#9C27B0',
        'deep-purple': '#673AB7',
        'indigo': '#3F51B5',
        'light-blue': '#03A9F4',
        'cyan': '#00BCD4',
        'teal': '#009688',
        'green': '#4CAF50',
        'light-green': '#8BC34A',
        'lime': '#CDDC39',
        'yellow': '#FFEB3B',
        'amber': '#FFC107',
        'orange': '#FF9800',
        'deep-orange': '#FF5722',
        'brown': '#795548',
        'blue-grey': '#607D8B',
      },
    }
  },

  created() {

  },

  mounted() {
    
  },

  computed: {
    color() {
      if (this.profile.link.watcher_color == 'red accent-4') {
        return 'red'
      }

      return this.profile.link.watcher_color
    },

    border_color() {
      if (this.profile.link.watcher_border_color == 'red accent-4') {
        return 'red'
      }

      return this.profile.link.watcher_border_color
    },

    leaves() {
      let config = this.$current_component.leave_config
      let leave_types = config.leave_types
      let leaves = leave_types.filter(l => l.visible)

      leaves.sort((a, b) => a.position - b.position)

      return leaves.slice(0, 7)
    },

    trigger_all_quotas() {
      return this.$current_component.trigger_all_quotas
    },

    trigger_all_quotas_loading() {
      return this.$current_component.trigger_all_quotas_loading
    },
  },

  methods: {
    async get_quota(end) {
      this.quota_toggled = true
      this.quota_loading = true

      let request = await this.$http.get('quotalight', {
        'end': end,
        'app_id': this.$current_app_id,
        'profile_id': this.profile.id,
        'month': this.$current_month,
        'year': this.$current_year,
      })

      this.quota = request.quota

      this.quota_loading = false
    },

    async try_set_color() {
      if (this.$current_component.palette && this.$current_component.palette_mode == 'profile') {
        let color = this.$current_component.palette_color
        this.profile.link.watcher_border_color = color

        await this.$http.post('calendar', {
          'action': 'update_profile_border',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'profile_id': this.profile.id,
          'color': color,
        })
      }
    },
  },

  watch: {
    trigger_all_quotas(value) {
      if (value) {
        this.get_quota('month_' + (this.start ? 'start' : 'end'))
      }
    },

    trigger_all_quotas_loading(value) {
      if (value) {
        this.quota_toggled = true
        this.quota_loading = true
      }
    },
  }
}

</script>


<style scoped>

.profile-frame {
  position: relative;
  display: block;
  max-width: 205px;
  min-width: 205px;
  max-height: 74px;
  min-height: 74px;
  font-size: 13px;
  border-radius: 5px;
  margin-left: 2px;
  margin-bottom: 2px;
  padding: 3px 5px 3px 5px;
  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  line-height: 17px;
  position: relative;
  text-align: left;
  box-shadow: inset 0 0 0 1px rgba(150, 150, 150, 0.5);
  background-color: white;
  color: black;
}

.profile-frame:hover {
  filter: contrast(1.2);
}

.profile-grade {
  font-size: 12px;
}

.profile-toggle {
  position: absolute;
  top: 43px;
  left: 168px;
  max-width: 29px !important;
  max-height: 29px !important;
  min-width: 29px !important;
  min-height: 29px !important;
  border-color: rgba(255, 255, 255, 0);
}

table {
  border-collapse: collapse;
  position: relative;
  top: 1px;
  left: -5px;
}

td {
  border: 1px rgb(190, 190, 190) solid;
  text-align: center;
  height: 26px;
  min-width: 24px;
  background-color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

td:last-child {
}

.leave {
  font-size: 14px;
}

.value {
  font-size: 12px;
  color: black;
}

</style>
