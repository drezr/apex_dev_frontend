<template>

<v-app>
  <div class="main-frame" id="main-frame">
    <BarDesktop v-if="$logged_profile" />

<!--     <div class="d-flex justify-center mt-6">
      <div class="d-flex">
        <button
          class="pa-3 mx-3"
          style="border: 1px black solid;"
          @mousedown="in1 = true"
          @mouseup="in1 = false"
          @mouseleave="in1 = false"
          :class="in1 ? 'orange' : ''"
          @click="go('in1')"
        >
          C1
        </button>

        <button
          class="pa-3 mx-3"
          style="border: 1px black solid;"
          @mousedown="in2 = true"
          @mouseup="in2 = false"
          @mouseleave="in2 = false"
          :class="in2 ? 'orange' : ''"
          @click="go('in2')"
        >
          C2
        </button>

        <div
          style="border: 1px black solid; width: 45px; height: 50px;"
          class="mx-3 d-flex justify-center align-center"
          :class="out ? 'green' : 'red'"
        >
          OUT
        </div>

        <div
          style="border: 1px black solid; width: 45px; height: 50px;"
          class="mx-3 d-flex justify-center align-center"
          :class="!m1 ? 'green' : 'red'"
        >
          M1
        </div>

        <div
          style="border: 1px black solid; width: 45px; height: 50px;"
          class="mx-3 d-flex justify-center align-center"
          :class="!m2 ? 'green' : 'red'"
        >
          M2
        </div>
      </div>
    </div> -->

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
/*      t1: false,
      t2: false,
      m1: false,
      m2: false,
      out: false,
      in1: false,
      in2: false,*/
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

      setTimeout(() => {
        this.$store.commit('set_logged_profile', null)
        this.$router.push({'path': '/login'})
      }, 1000)
      
    },

/*    go(input) {
      if (input == 'in1') {
        if (!this.m2) {
          this.m1 = true
        }
      }

      if (input == 'in2') {
        if (this.m1) {
          this.out = true

          clearInterval(this.t1)
          this.t1 = setTimeout(() => {
            this.out = false
            this.m1 = false
          }, 2000)
        }

        else {
          this.m2 = true

          clearInterval(this.t2)
          this.t2 = setTimeout(() => this.m2 = false, 5000)
        }
      }
    },*/
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

.white-space-pre {
  white-space: pre !important;
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

.cursor-fill {
  cursor: url('data:image/x-icon;base64,AAACAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAR0dHAP///wAiIiIAMjIyABYWFgA9PT0AODg4AE9PTwBfX18AKioqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAKMAAAAAAAAAAAAAAAAAAAoiMAAAAAAAAAAAAAAAAAACIiYAAAAAAAAAAAAAYAAAIiIiMAAAAAAAAAAAADAAAiIiIiAAAAAAAAAAAAUFACIiIiIiQAAAAAAAAAADAKIiIiIiIgAAAAAAAAAAAGMiImIiIiEAAAAAAAAAAAUAIiApIiJgAAAAAAAAAAAApgIiAiIgAAAAAAAAAAAAAAAKIoIiAAAAAAAAAAAAAAAABwICIAAAAAAAAAAAAAAAAAAAAlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAIAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////35///58P//8eB///HAP//xgB//8QAP//AAD//wAB//8AA///gAf//8AP///wD////C////5v///+7////x///w=='), auto !important;
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
