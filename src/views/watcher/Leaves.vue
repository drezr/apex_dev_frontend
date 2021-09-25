<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title my-3">
        {{ team.name }}

        <CustomButton
          @click="leave_config_dialog = true"
          :tooltip="lang.views.watcher.leaves_config[lg]"
          :icon="'mdi-cog'"
          :color="'teal'"
          :text_color="'white'"
          class="ml-3"
        ></CustomButton>
      </div>

      <div v-if="config.leave_count > 0" class="d-flex justify-center mt-3">
        <div>
          <Leave
            v-for="(profile, i) in team.profiles"
            :key="i"
            :profile="profile"
            :parent="$current_component"
            class="mb-1"
          ></Leave>
        </div>
      </div>

      <div v-else class="d-flex justify-center align-center my-16">
        <div class="text-center">
          {{ lang.views.watcher.leaves_no_leave_set_1[lg] }}<br>
          <small>{{ lang.views.watcher.leaves_no_leave_set_2[lg] }}</small>
        </div>
      </div>
    </div>
  </transition>

  <CustomDialog
    :open="customize_dialog"
    :width="800"
    :title_text="lang.views.radium.customize_tooltip[lg]"
    :title_icon="'mdi-tune-vertical'"
    @cancel="customize_dialog = false"
  >
    <div
      v-for="(column, i) in columns"
      :key="i"
      class="works-customize-row"
    >
      <v-icon class="cursor-move handle mr-3 pink--text">
        mdi-drag-horizontal-variant
      </v-icon>

      <div style="width: 200px; text-align: center;" class="black--text">
        <b>{{ lang.views.radium['column_title_' + column.name][lg] }}</b>
      </div>

      <v-text-field
        v-model="column.width"
        :label="lang.generic.column_width[lg]"
        type="number"
        class="mx-3"
        outlined
        hide-details
      />

      <v-text-field
        v-model="column.textsize"
        :label="lang.generic.text_size[lg]"
        type="number"
        class="mx-3"
        outlined
        hide-details
      />

      <v-checkbox
        v-model="column.visible"
        :label="lang.generic.visible[lg]"
        class="mx-3"
        hide-details
        style="position: relative; top: -10px;"
      ></v-checkbox>
    </div>
  </CustomDialog>
</div>

</template>


<script>

import Leave from '@/views/watcher/components/Leave.vue'

export default {
  name: 'Leaves',

  components: {
    Leave,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      leaves: Array(),
      config: Object(),
      leave_config_dialog: false,
      customize_dialog: false,
    }
  },

  async created() {
    this.request = await this.$http.get('leaves', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.leaves = this.request.leaves
    this.config = this.request.config

    this.team.profiles.sort((a, b) => a.link.position - b.link.position)

    for (let profile of this.team.profiles) {
      profile.leaves = this.leaves.find(l => l.profile == profile.id)
    }

    this.loading = false
  },

  computed: {
    leave_types() {
      let leave_types = Array()

      for (let i = 0; i < this.config.leave_count; i++) {
        leave_types.push({
          'generic_name': 'leave_' + i,
          'name': this.config['leave_' + i + '_name'],
          'desc': this.config['leave_' + i + '_desc'],
          'type': this.config['leave_' + i + '_type'],
          'color': this.config['leave_' + i + '_color'],
        })
      }

      return leave_types
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

</style>
