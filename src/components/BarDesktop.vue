<template>

<div class="bar-desktop elevation-1">
  <div class="d-flex">
    <router-link class="navigation" :to="'/'">
      <img :src="$tool.get_logo('apex_50x50')" class="logo" />
      <span class="text-h6 ml-3 mr-3" v-if="$mobile_breakpoint">APEX</span>
    </router-link>

    <div class="d-flex" v-if="$current_team_id">
      <v-icon>mdi-chevron-right</v-icon>

      <router-link class="navigation" :to="`/team/${$current_team_id}`">
        <img :src="$tool.get_logo('hub_50x50')" class="logo" />
        <span class="text-h6 ml-3 mr-3" v-if="$mobile_breakpoint">HUB</span>
      </router-link>
    </div>

    <div class="d-flex" v-if="$current_app_id">
      <v-icon>mdi-chevron-right</v-icon>

      <router-link class="navigation" :to="app_path">
        <img :src="$tool.get_logo($route.meta.app + '_50x50')" class="logo" />
        <span class="text-h6 ml-3 mr-3" v-if="$mobile_breakpoint">{{ $route.meta.app.toUpperCase() }}</span>
      </router-link>
    </div>
  </div>


  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on, attrs }">
      <span
        class="grey--text text--darken-2 subtitle-2"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon class="user-icon">mdi-account-circle</v-icon>
        <span v-if="$mobile_breakpoint">
          {{ $logged_profile.name }}
        </span>
      </span>
    </template>

    <v-list>
      <v-list-item link @click="password_dialog = true">
        <v-list-item-title>
          <v-icon class="mr-3">mdi-lock</v-icon>
          {{ lang.generic.change_password[lg] }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="logout" link>
        <v-list-item-title>
          <v-icon class="mr-3">mdi-logout</v-icon>
          {{ lang.generic.disconnect[lg] }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</div>

</template>


<script>

export default {
  name: '',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      password_dialog: false,
    }
  },

  created() {

  },

  computed: {
    app() {
      return this.$parent.$parent
    },

    app_path() {
      if (this.$current_app_id) {
        if (this.$route.meta.app == 'watcher') {
          return `/team/${this.$current_team_id}/watcher/${this.$current_app_id}/calendar/month/${this.$current_month}/year/${this.$current_year}`
        }

        else if (this.$route.meta.app == 'radium') {
          return `/team/${this.$current_team_id}/radium/${this.$current_app_id}/works/month/${this.$current_month}/year/${this.$current_year}`
        }
      }

      return '/'
    },
  },

  methods: {
    go() {
      return '/'
    },

    logout() {
      this.app.logout()
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.bar-desktop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(240, 240, 240);
  padding: 0 25px;
  width: 100%;
  height: 60px;
  position: sticky;
  left: 0;
}

.logo {
  width: 40px;
}

.navigation {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 30px;
  background-color: rgb(220, 220, 220);
  text-decoration: none;
  color: black;
}

.navigation:hover {
  background-color: white;
}

.user-icon {
  position: relative;
  top: -2px;
  margin-right: 5px;
}

</style>
