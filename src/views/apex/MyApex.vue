<template>

<div class="team-frame">
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div v-if="apps.length > 0">
        <div class="team-title my-9">
          {{ lang.views.myapex.my_applications[lg] }}
        </div>

        <div class="tiles-frame">
          <Tile
            v-for="(app, i) in apps"
            :key="i"
            :self="app"
            class="ma-3"
          />
        </div>
      </div>

      <div v-if="not_installed_apps.length > 0">
        <div class="team-title my-12">
          {{ lang.views.myapex.install_apps[lg] }} :
        </div>

        <div class="addbuttons-frame">
          <div
            v-for="(app, i) in not_installed_apps"
            :key="i"
            class="addbutton"
            :class="app.color"
            @click="add_app(app.title.toLowerCase())"
          >
            <v-img
              :src="$tool.get_logo(app.title.toLowerCase() + '_50x50')"
              style="width: 50px; height: 50px;"
            />

            <div class="ml-3 mr-6" style="line-height: 23px;">
              <span class="addbutton-title">{{ app.title }}</span><br>
              <span class="addbutton-desc">{{ app.desc }}</span>
            </div>

            <v-icon
              large
              class="white--text"
              :ref="'icon_' + app.title.toLowerCase()"
            >
              mdi-download-circle
            </v-icon>

            <Loader
              :size="30"
              :width="5"
              :color="'white'"
              class="d-none"
              :ref="'loader_' + app.title.toLowerCase()"
              style="margin-right: 6px;"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>

</template>


<script>

import Tile from '@/views/apex/components/Tile.vue'

export default {
  name: 'TeamView',

  components: {
    Tile,
  },

  props: {
    
  },

  data() {
    return {
      apps: Object(),
      resquest: null,
      loading: true,
      myapex_apps: [
        'draft',
        'nexus',
      ],
    }
  },

  async created() {
    this.request = await this.$http.get('myapex', {})
    console.log(this.request)

    this.apps = this.request.profile.apps
    this.sort_apps()

    this.loading = false
  },

  computed: {
    not_installed_apps() {
      let apps = Array()
      let myapex_apps = Object()

      for (let app of this.myapex_apps) {
        myapex_apps[app] = this.$app_descriptions[app]
      }

      for (let app in myapex_apps) {
        if (!this.apps.find((a) => a.app == app)) {
          apps.push(this.$app_descriptions[app])
        }
      }

      return apps
    },
  },

  methods: {
    add_app(app_name) {
      // Request app add

      let dummy_app = {
        'id': this.$tool.gen_uid(),
        'app': app_name,
        'profile': this.$logged_profile.id,
        'files': null,
        'name': null,
        'notes': null,
        'projects': null,
        'radium_config': null,
        'tasks': null,
        'team': null,
        'templates': null,
      }

      this.$refs['icon_' + app_name][0].$el.classList.add('d-none')
      this.$refs['loader_' + app_name][0].$el.classList.remove('d-none')

      // Emulate slow request
      setTimeout(() => {
        this.apps.push(dummy_app)
        this.sort_apps()
      }, 1000)
    },

    sort_apps() {
      this.apps.sort((a, b) => {
        a = a.name || ''
        b = b.name || ''
        
        return a.localeCompare(b)
      })

      this.apps.sort((a, b) => (a.app).localeCompare(b.app))
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.tiles-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 100%;
}

.addbuttons-frame {
  display: flex;
  justify-content: center;
  align-items: center;
}

.addbutton {
  display: flex;
  color: white;
  padding: 5px;
  border-radius: 100px;
  margin: 0 10px;
  cursor: pointer;
  transition: filter .2s;
}

.addbutton:hover {
  filter: brightness(1.2);
}

.addbutton-title {
  font-weight: bold;
  font-size: 24px;
}

.addbutton-desc {
  
}

</style>
