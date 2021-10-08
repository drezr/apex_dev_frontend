<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title my-3">
        {{ profile.name }}
      </div>

      <div class="d-flex justify-center">
        <div
          class="leave-frame"
          v-for="(leave_type, i) in leaves_data"
          :key="i"
        >
          <v-tooltip
            :top="true"
            color="black"
          >
            <template v-slot:activator="{ on: show_tooltip }">
              <div class="leave-upper" v-on="show_tooltip">
                <div
                  style="height: 100%;"
                  class="lighten-4 text--darken-4 white--text d-flex justify-center align-center"
                  :class="[
                    leave_type.color,
                    leave_type.color + '--text'
                  ]"
                >
                  <b>{{ leave_type.name }}</b>
                </div>
              </div>
            </template>

            <span>{{ leave_type.desc }}</span>
          </v-tooltip>

          <div
            class="leave-lower"
          >
            {{ quota['type_' + i] }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>

</template>


<script>

export default {
  name: 'Quota',

  components: {
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      profile: Object(),
      quota: Array(),
      config: Object(),
      leave_config_dialog: false,
      leave_colors: [
        'red',
        'pink',
        'purple',
        'deep-purple',
        'indigo',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'blue-grey',
      ],
    }
  },

  async created() {
    this.request = await this.$http.get('quota', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'profile_id': this.$current_profile_id,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.quota = this.request.quota
    this.profile = this.request.profile
    this.config = this.request.config

    for (let i = 0; i < 20; i++) {
      this.quota['type_' + i] = Number(this.quota['type_' + i])
    }

    this.loading = false
  },

  computed: {
    leaves_data() {
      let leaves_data = Array()

      for (let i = 0; i < this.config.leave_count; i++) {
        leaves_data.push({
          'generic_name': 'leave_' + i,
          'name': this.config['leave_' + i + '_name'],
          'desc': this.config['leave_' + i + '_desc'],
          'type': this.config['leave_' + i + '_type'],
          'color': this.config['leave_' + i + '_color'],
          'visible': this.config['leave_' + i + '_visible'],
        })
      }

      return leaves_data
    },
  },

  methods: {

  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.leave-frame {
  border: 1px grey solid;
  border-radius: 7px;
  overflow: hidden;
  width: 60px;
  margin: 0px 5px;
  background-color: rgba(150, 150, 150, 0.1);
}

.leave-upper {
  border-radius: 5px;
  overflow: hidden;
  height: 33px;
  margin: 1px;
  text-shadow: 1px 1px 0px white;
}

.leave-lower {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 31px;
  width: 52px;
  margin: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  outline-color: orange;
  text-align: center;
}

</style>
