<template>

<div class="d-flex">
  <Profile :profile="profile" />

  <div
    v-for="(leave_type, i) in parent.leaves_data"
    :key="i"
  >
    <div class="leave-frame">
      <v-tooltip
        :top="true"
        color="black"
      >
        <template v-slot:activator="{ on: show_tooltip }">
          <div class="leave-upper" v-on="show_tooltip">
            <div
              style="height: 100%;"
              class="lighten-1 white--text d-flex justify-center align-center"
              :class="leave_type.color"
            >
              <b>{{ leave_type.name }}</b>
            </div>
          </div>
        </template>

        <span>{{ leave_type.desc }}</span>
      </v-tooltip>

      <input
        type="text"
        class="leave-lower"
        v-model="profile.leaves['type_' + i]"
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
    parent: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {

    }
  },

  created() {

  },

  computed: {

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
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
}

.leave-lower {
  height: 32px;
  width: 53.5px;
  margin: 2px;
  background-color: white;
  border-radius: 5px;
  border: 1px grey solid;
  outline-color: orange;
  text-align: center;
}

</style>
