<template>

<div class="d-flex">
  <Profile :profile="profile" />

  <div
    v-for="(leave_type, i) in $current_component.config.leave_types.filter(l => l.visible && l.kind != 'counter')"
    :key="i"
  >
    <div class="leave-frame">
      <v-tooltip
        :top="true"
        color="black"
        :disabled="!leave_type.desc"
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
              <b>{{ !leave_type ? leave_type : leave_type.code.toUpperCase() }}</b>
            </div>
          </div>
        </template>

        <span>{{ leave_type.desc }}</span>
      </v-tooltip>

      <input
        v-if="profile.quotas.find(q => q.code == leave_type['code'])"
        type="number"
        class="leave-lower"
        v-model="profile.quotas.find(q => q.code == leave_type['code']).value"
        @input="update_leave(leave_type['code'])"
        onkeydown="return ![69, 107].includes(event.keyCode)"
        @focus="$event.target.select()"
      >  
    </div>
  </div>
</div>

</template>


<script>

import Profile from '@/views/watcher/components/Profile.vue'

export default {
  name: 'Leave',

  components: {
    Profile,
  },

  props: {
    profile: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      is_updating: false,
      update_timer: null,
    }
  },

  created() {

  },

  computed: {

  },

  methods: {
    async update_leave(code) {
      let quota = this.profile.quotas.find(q => q.code == code)

      setTimeout(() => {
        quota.value == '' ? quota.value = 0 : quota.value
        quota.value = Math.round((parseFloat(quota.value) + Number.EPSILON) * 100) / 100
      }, 5000)


      if (!this.is_updating) {
        clearInterval(this.update_timer)
      }

      this.update_timer = setTimeout(async () => {
        await this.$http.post('leaves', {
          'action': 'update_leave',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'profile_id': this.profile.id,
          'year': this.$current_year,
          'element_type': code,
          'value': quota.value,
        })
      }, 100)
    },

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
  height: 33px;
  width: 54px;
  margin: 2px;
  background-color: white;
  border-radius: 5px;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  outline-color: orange;
  text-align: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance:textfield;
}

</style>
