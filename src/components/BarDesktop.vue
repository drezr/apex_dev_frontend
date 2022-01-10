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


  <v-menu offset-y open-on-hover min-width="300">
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

      <v-divider class="my-6"></v-divider>

      <v-list-item>
        <v-icon class="mr-3 mb-1">mdi-translate</v-icon>
        {{ lang.views.home.select_language[lg] }}
      </v-list-item>

      <v-list-item-group
        v-model="selected_language"
        color="primary"
      >
        <v-list-item
          v-for="(language, i) in languages"
          :key="i"
          class="mx-3"
          link
          @click="change_language(i)"
          :disabled="selected_language == i"
        >
          <v-list-item-content class="ml-3">
            <v-list-item-title>
                <v-icon small v-if="selected_language == i" class="mr-1">
                  mdi-check
                </v-icon>

                {{ language.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>

  <CustomDialog
    :open="password_dialog"
    :width="500"
    :title_text="lang.views.home.change_password[lg]"
    :confirm_icon="'mdi-send'"
    :confirm_text="lang.generic.send[lg]"
    :confirm_color="'green'"
    :confirm_disabled="!are_passwords_same || current_password.length == 0 || new_password.length < 8"
    @cancel="password_dialog = false"
    @confirm="change_password"
  >
    <v-alert
      class="mt-3"
      type="error"
      v-if="error_message"
    >
      {{ error_message }}
    </v-alert>

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
      selected_language: null,
      error_message: null,
    }
  },

  created() {
    this.selected_language = this.languages.indexOf(this.languages.find(l => l.value == this.lg))
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

    languages() {
      return [
        {
          'name': this.lang.views.home.language_french[this.lg],
          'value': 'fr',
        },
        {
          'name': this.lang.views.home.language_dutch[this.lg],
          'value': 'nl',
        },
        {
          'name': this.lang.views.home.language_english[this.lg],
          'value': 'en',
        },
      ]
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

    async change_password() {
      this.error_message = null

      let request = await this.$http.post('home', {
        'action': 'change_password',
        'user_id': this.$logged_profile.user,
        'current_password': this.current_password,
        'new_password': this.new_password,
        'new_password2': this.new_password2,
      })

      if (request.result == 'success') {
        this.current_password = ''
        this.new_password = ''
        this.new_password2 = ''

        this.password_dialog = false

        this.password_snackbar = true
      }

      else if (request.result == 'length') {
        this.error_message = this.lang.views.home.error_password_length[this.lg]
      }

      else if (request.result == 'not_same') {
        this.error_message = this.lang.views.home.error_password_not_same[this.lg]
      }

      else if (request.result == 'bad') {
        this.error_message = this.lang.views.home.error_password_bad[this.lg]
      }
    },

    change_language(lg_index) {
      let lg = this.languages[lg_index].value
      this.selected_language = lg_index

      document.cookie = `language=${lg}; expires=Thu, 31 Dec 2023 12:00:00 UTC;`
      this.$store.commit('set_language', lg)
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
