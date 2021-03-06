<template>

<v-app>
  <div
    class="main-frame"
    id="main-frame"
    v-if="!$current_view.includes('mobile')"
  >
    <BarDesktop v-if="$logged_profile" />

    <router-view :key="$route.fullPath" style="max-height: 0px;" />
  </div>

  <div
    class="mobile-frame"
    id="mobile-frame"
    v-else-if="$current_view.includes('mobile') && !mobile_loading"
  >
    <BarMobile v-if="$logged_profile" />

    <router-view :key="$route.fullPath" style="max-height: 0px;" />

    <v-navigation-drawer
      v-model="drawer"
      width="300"
      absolute
      temporary
    >
      <div class="d-flex justify-space-between ma-3">
        <div class="drawer-profile-name">
          <b>
            <v-icon style="position: relative; top: -3px;">mdi-account</v-icon>
            {{ $logged_profile ? $logged_profile.name : '' }}
          </b>
        </div>

        <v-icon @click="drawer = false">
          mdi-close
        </v-icon>
      </div>

      <v-divider class="my-3"></v-divider>

      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="mobile_view"
          active-class="blue--text text--accent-4"
        >
          <v-list-item @click="go_to('calendar')">
            <v-list-item-icon>
              <v-icon>mdi-calendar-check</v-icon>
            </v-list-item-icon>

            <v-list-item-title>
              {{ lang.views.mobile.my_calendar[lg] }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item @click="go_to('quota')">
            <v-list-item-icon>
              <v-icon>mdi-calendar-range</v-icon>
            </v-list-item-icon>

            <v-list-item-title>
              {{ lang.views.mobile.my_quotas[lg] }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item @click="go_to('works')">
            <v-list-item-icon>
              <v-icon>mdi-hammer-wrench</v-icon>
            </v-list-item-icon>

            <v-list-item-title>
              {{ lang.views.mobile.my_works[lg] }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <div class="text-center my-6">
            <v-icon class="mr-3 mb-1">mdi-translate</v-icon>
            {{ lang.views.home.select_language[lg] }}

            <div class="d-flex justify-space-around mt-3">
              <div
                class="cursor-pointer blue--text"
                :class="is_language('fr') ? 'lang-selected' : ''"
                @click="change_language(0)"
              >
                FR
              </div>

              <div
                class="cursor-pointer blue--text"
                :class="is_language('nl') ? 'lang-selected' : ''"
                @click="change_language(1)"
              >
                NL
              </div>

              <div
                class="cursor-pointer blue--text"
                :class="is_language('en') ? 'lang-selected' : ''"
                @click="change_language(2)"
              >
                EN
              </div>
            </div>
          </div>

          <CustomButton
            :text="lang.generic.disconnect[lg]"
            :color="'blue'"
            :dark="true"
            :icon="'mdi-logout'"
            :block="true"
            style="width: 100%;"
            @click="logout()"
          />
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</v-app>

</template>


<script>

import BarDesktop from '@/components/BarDesktop.vue'
import BarMobile from '@/components/BarMobile.vue'

export default {
  name: 'App',

  components: {
    BarDesktop,
    BarMobile,
  },

  props: {
    
  },

  data() {
    return {
      drawer: false,
      mobile_view: 0,
      mobile_loading: true,
      selected_language: null,
    }
  },

  async created() {
    this.set_language()
    this.log_user()

    if (this.$current_view == 'quotamobile') {
      this.mobile_view = 1
    }

    else if (this.$current_view == 'worksmobile') {
      this.mobile_view = 2
    }

    this.selected_language = this.languages.indexOf(this.languages.find(l => l.value == this.lg))
  },

  computed: {
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
    async log_user() {
      let token = this.$tool.get_cookie('token')
      let username = this.$tool.get_cookie('username')

      if (!token) {
        if (this.$current_view != 'login') {
          this.$router.push({'path': '/login'})
        }
      }

      else {
        this.$http.header = {Authorization: 'Token ' + token}

        let profile = await this.$http.get('profile', {'username': username})

        if (profile.profile) {
          this.$store.commit('set_logged_profile', profile.profile)
        }

        else {
          this.logout()
        }
      } 
    },

    logout() {
      this.$http.header = {}

      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      document.cookie = `sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      document.cookie = `csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`

      setTimeout(() => {
        this.$store.commit('set_logged_profile', null)
        this.$router.push({'path': '/login'})
      }, 100)
    },

    set_language() {
      let language_cookie = this.$tool.get_cookie('language')

      if (language_cookie) {
        this.$store.commit('set_language', language_cookie)
      }

      else {
        let language = navigator.language.split('-')[0]

        document.cookie = `language=${language}; expires=Thu, 31 Dec 2023 12:00:00 UTC;`

        this.$store.commit('set_language', language)
      }
    },

    go_to(view) {
      this.drawer = false
      let route = null

      if (view == 'calendar') {
        route = `/mobile/calendar/month/${this.$current_month}/year/${this.$current_year}`
      }

      else if (view == 'quota') {
        route = `/mobile/quota/year/${this.$current_year}`
      }

      else if (view == 'works') {
        route = `/mobile/works/month/${this.$current_month}/year/${this.$current_year}`
      }

      if (this.$route.fullPath != route) {
        this.$router.push(route)
      }
    },

    change_language(lg_index) {
      let lg = this.languages[lg_index].value
      this.selected_language = lg_index

      document.cookie = `language=${lg}; expires=Thu, 31 Dec 2023 12:00:00 UTC;`
      this.$store.commit('set_language', lg)
    },

    is_language(lg) {
      return this.lg == lg
    },
  },

  watch: {
    $logged_profile(value) {
      if (value) this.mobile_loading = false
      else this.mobile_loading = true
    }
  },
}

</script>


<style>

html {
  overflow: hidden !important;
}

.cursor-default {
  cursor: default !important;
}

.cursor-pointer {
  cursor: pointer !important;
}

.cursor-move {
  cursor: move !important;
}

.cursor-grab {
  cursor: grab !important;
}

.cursor-text {
  cursor: text !important;
}

.cursor-copy {
  cursor: copy !important;
}

.cursor-cell {
  cursor: cell !important;
}

.cursor-not-allowed {
  cursor: not-allowed !important;
}

.opacity-0 {
  opacity: 0 !important;
}

.pointer-events-none {
  pointer-events: none !important;
}

.hover-brightness:hover {
  filter: brightness(1.3) !important;
}

.white-space-pre {
  white-space: pre-line !important;
}

@media print {    
  .no-print, .no-print * {
    display: none !important;
  }
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.font-size-8 { font-size: 8px !important; }
.font-size-9 { font-size: 9px !important; }
.font-size-10 { font-size: 10px !important; }
.font-size-11 { font-size: 11px !important; }
.font-size-12 { font-size: 12px !important; }
.font-size-13 { font-size: 13px !important; }

.team-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  height: 80px;
  width: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.command-buttons-bg {
  background-color: rgb(230, 230, 230);
  padding: 5px;
  border-radius: 100px;
}

.custom-field textarea {
  margin-top: 10px !important;
  margin-bottom: 5px !important;
}

.custom-field textarea:disabled {
  color: black !important;
}

.custom-field input:disabled {
  color: black !important;
}

.cursor-fill * {
  cursor: url('data:image/x-icon;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAR0dHAP///wAiIiIAMjIyABYWFgA9PT0AODg4AE9PTwBfX18AKioqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAKMAAAAAAAAAAAAAAAAAAAoiMAAAAAAAAAAAAAAAAAACIiYAAAAAAAAAAAAAYAAAIiIiMAAAAAAAAAAAADAAAiIiIiAAAAAAAAAAAAUFACIiIiIiQAAAAAAAAAADAKIiIiIiIgAAAAAAAAAAAGMiImIiIiEAAAAAAAAAAAUAIiApIiJgAAAAAAAAAAAApgIiAiIgAAAAAAAAAAAAAAAKIoIiAAAAAAAAAAAAAAAABwICIAAAAAAAAAAAAAAAAAAAAlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAIAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////35///58P//8eB///HAP//xgB//8QAP//AAD//wAB//8AA///gAf//8AP///wD////C////5v///+7////x///w=='), auto !important;
}

.v-dialog {
  margin: 3px !important;
  max-height: calc(100% - 120px) !important;
}

</style>


<style scoped>

.main-frame {
  display: block !important;
  max-width: 100% !important;
  min-width: 100% !important;
  max-height: 100% !important;
  min-height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: auto !important;
}

.mobile-frame {
  overflow-y: scroll;
  height: 100%;
}

.drawer-profile-name {
  white-space: nowrap;
  width: 240px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.lang-selected {
  font-weight: bold;
}

</style>
