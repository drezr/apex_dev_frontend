<template>

<router-link
  :to="`/team/${$current_team_id}/watcher/${$current_app_id}/quota/profile/${profile.id}/year/${$current_year}`"
  class="profile-frame lighten-4"
  :class="[
    color + ' lighten-4',
    color + '--text text--darken-4',
  ]"
>
  <div><b>{{ profile.name }}</b></div>
  <div v-if="!quota_toggled">
    <div class="profile-grade">
      {{ profile.grade }} {{ profile.field }}
    </div>
    <div>{{ profile.ident }}</div>
    <div>{{ profile.phone }}</div>
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
  },

  data() {
    return {
      quota_toggled: false,
      quota_loading: true,
      leaves: ['cn', 'jc', 'cv', 'ch', 'rh', 'rr', 'hs'],
      quota: {'cn': 0, 'jc': 0, 'cv': 0, 'ch': 0, 'rh': 0, 'rr': 0, 'hs': 0},
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
  },

  methods: {

  },

  watch: {

  }
}

</script>


<style scoped>

.profile-frame {
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

</style>
