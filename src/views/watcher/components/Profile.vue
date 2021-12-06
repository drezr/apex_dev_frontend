<template>

<router-link
  :to="`/team/${$current_team_id}/watcher/${$current_app_id}/quota/profile/${profile.id}/year/${$current_year}`"
  class="profile-frame lighten-4"
  :class="[
    color + ' lighten-4',
    color + '--text text--darken-4',
    (!$has_xs(['watcher_can_see_quotas']) && profile.id != $logged_profile.id) ? 'pointer-events-none' : '',
  ]"
>
  <div v-if="!quota_toggled">
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
            {{quota[leave.code]}}
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
  },

  methods: {
    async get_quota(end) {
      this.quota_loading = true
      this.quota_toggled = true

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
  },

  watch: {
    trigger_all_quotas(value) {
      if (value) {
        this.get_quota('month_' + (this.start ? 'start' : 'end'))
      }
    }
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
  max-width: 30px !important;
  max-height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
  margin-top: -85px;
  margin-right: -30px;
  position: relative;
  top: 21px;
  left: 167px;
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
