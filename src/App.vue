<template>

<v-app>
  <div class="main-frame" id="main-frame">
    <BarDesktop v-if="$logged_profile" />

    <router-view :key="$route.fullPath" style="max-height: 0px;" />
  </div>
</v-app>

</template>


<script>

import BarDesktop from '@/components/BarDesktop.vue'

export default {
  name: 'App',

  components: {
    BarDesktop,
  },

  props: {
    
  },

  data() {
    return {

    }
  },

  async created() {
    this.log_user()
  },

  computed: {

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

      this.$store.commit('set_logged_profile', null)

      setTimeout(() => {
        this.$router.push({'path': '/login'})
      }, 100)
      
    },
  },

  watch: {

  },
}

</script>


<style>

html {
  overflow: hidden !important;
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

.opacity-0 {
  opacity: 0 !important;
}

.pointer-events-none {
  pointer-events: none !important;
}

.hover-brightness:hover {
  filter: brightness(1.3) !important;
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

</style>
