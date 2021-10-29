<template>

<div class="bar-desktop elevation-1" v-if="bar_is_visible">
  <div class="d-flex">
    <router-link class="navigation" :to="'/'">
      <img :src="$tool.get_logo('apex_50x50')" class="logo" />
      <span class="text-h6 ml-3 mr-3" v-if="$mobile_breakpoint">APEX</span>
    </router-link>

    <div class="d-flex" v-if="$current_team_id">
      <v-icon>mdi-chevron-right</v-icon>

      <router-link class="navigation" :to="`/team/${$current_team_id}`">
        <img :src="$tool.get_logo('hub_50x50')" class="logo" />
        <span class="text-h6 ml-3 mr-3" v-if="$mobile_breakpoint">
          {{ lang.generic.team[lg].toUpperCase() }}
        </span>
      </router-link>
    </div>

    <div class="d-flex" v-if="$current_view.includes('myapex')">
      <v-icon>mdi-chevron-right</v-icon>

      <router-link class="navigation" :to="`/myapex`">
        <img :src="$tool.get_logo('myapex_50x50')" class="logo" />
        <span class="text-h6 ml-3 mr-3" v-if="$mobile_breakpoint">MYAPEX</span>
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

  <CustomDialog
    :open="password_dialog"
    :width="500"
    :title_text="lang.views.home.change_password[lg]"
    :confirm_icon="'mdi-send'"
    :confirm_text="lang.generic.send[lg]"
    :confirm_color="'green'"
    @cancel="password_dialog = false"
    @confirm="change_password"
  >
    <v-card-text class="mt-8 px-8 pb-0">
      <v-text-field
        v-model="current_password"
        :type="show_current ? 'text' : 'password'"
        :label="lang.views.home.current_password[lg]"
        required
        outlined
        prepend-inner-icon="mdi-lock"
        class="mb-4"
      >
        <template v-slot:append>
          <v-icon
            v-if="!show_current"
            @click="show_current = !show_current"
            tabindex="-1"
          >
            mdi-eye-off
          </v-icon>

          <v-icon
            v-if="show_current"
            @click="show_current = !show_current"
            tabindex="-1"
          >
            mdi-eye
          </v-icon>
        </template>
      </v-text-field>

      <v-text-field
        v-model="new_password"
        :type="show_new ? 'text' : 'password'"
        :label="lang.views.home.new_password[lg]"
        :hint="lang.views.home.min_8_character[lg]"
        counter
        required
        outlined
        color="purple"
        @input="check_passwords_same"
      >
        <template v-slot:append>
          <v-icon
            v-if="!show_new"
            @click="show_new = !show_new"
            tabindex="-1"
          >
            mdi-eye-off
          </v-icon>

          <v-icon
            v-if="show_new"
            @click="show_new = !show_new"
            tabindex="-1"
          >
            mdi-eye
          </v-icon>
        </template>
      </v-text-field>

      <v-text-field
        v-model="new_password2"
        :type="show_new2 ? 'text' : 'password'"
        :label="lang.views.home.new_password_confirm[lg]"
        :hint="lang.views.home.min_8_character[lg]"
        required
        outlined
        color="purple"
        @input="check_passwords_same"
        :error="are_passwords_same == false"
        :success="are_passwords_same == true"
      >
        <template v-slot:append>
          <v-icon
            v-if="!show_new2"
            @click="show_new2 = !show_new2"
            tabindex="-1"
          >
            mdi-eye-off
          </v-icon>

          <v-icon
            v-if="show_new2"
            @click="show_new2 = !show_new2"
            tabindex="-1"
          >
            mdi-eye
          </v-icon>
        </template>
      </v-text-field>
    </v-card-text>
  </CustomDialog>

  <v-snackbar
    v-model="password_snackbar"
    :timeout="password_timeout"
  >
    {{ lang.views.home.password_change_success[lg] }}
  </v-snackbar>
</div>

</template>


<script>

export default {
  name: 'BarDesktop',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      password_dialog: false,
      current_password: '',
      new_password: '',
      new_password2: '',
      show_current: false,
      show_new: false,
      show_new2: false,
      alert: '',
      are_passwords_same: null,
      password_snackbar: false,
      password_timeout: 4000,
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

        else if (this.$route.meta.app == 'planner') {
          return `/team/${this.$current_team_id}/planner/${this.$current_app_id}/board/month/${this.$current_month}/year/${this.$current_year}`
        }

        else if (this.$route.meta.app == 'draft') {
          if (['projects', 'project'].includes(this.$current_view)) {
            return `/team/${this.$current_team_id}/draft/${this.$current_app_id}/projects/`
          }
          
          else if (['myapexprojects', 'myapexproject'].includes(this.$current_view)) {
            return `/myapex/draft/${this.$current_app_id}/projects`
          }
        }

        else if (this.$route.meta.app == 'nexus') {
          return `/myapex/nexus/${this.$current_app_id}/contacts/day/${this.$current_day}/month/${this.$current_month}/year/${this.$current_year}`
        }
      }

      return '/'
    },

    bar_is_visible() {
      return !this.$current_view.includes('printable')
    },
  },

  methods: {
    go() {
      return '/'
    },

    logout() {
      this.app.logout()
    },

    check_passwords_same() {
      this.are_passwords_same = this.new_password == this.new_password2
    },

    change_password() {
      this.password_dialog = false

      this.password_snackbar = true
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
