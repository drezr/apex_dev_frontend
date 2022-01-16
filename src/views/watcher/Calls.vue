<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" style="padding-bottom: 50px;">
      <div class="team-title my-3">
        {{ team.name }}
      </div>

      <NavigationBar class="mb-3" />

      <v-card max-width="800" class="mx-auto my-10">
        <v-toolbar
          flat
          color="primary"
          dark
        >
          <v-toolbar-title>
            <v-icon class="mr-3">mdi-hammer-screwdriver</v-icon>

            {{ lang.views.watcher.calls_title[lg] }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <div class="d-flex align-center">
            {{ lang.views.watcher.calls_with_d27[lg] }}

            <v-switch
              class="ml-3"
              v-model="with_d27"
              hide-details
            ></v-switch>
          </div>
        </v-toolbar>

        <div class="d-flex">
          <v-tabs v-model="tab" vertical class="call-tab">
            <v-tab class="call-tab">
              <v-icon left>
                mdi-account-group
              </v-icon>

              <span class="mt-1">
                {{ lang.generic.all_alt[lg] }} ({{ calls.filter(c => with_d27 ? (c.files.length > 0 || c.links.length > 0) : true).length }})
              </span>
            </v-tab>

            <v-tab
              v-for="(profile, i) in visible_profiles"
              :key="i"
              class="call-tab"
            >
              <v-icon left>
                mdi-account
              </v-icon>

              <span class="mt-1">
                {{ profile.name.substring(0, 18) }}
                {{ profile.name.length > 18 ? '...' : '' }}
                ({{ calls.filter(c => (c.profile.id == profile.id) && (with_d27 ? (c.files.length > 0 || c.links.length > 0) > 0 : true)).length }})
              </span>
            </v-tab>
          </v-tabs>

          <v-card flat v-if="filtered_calls.length > 0">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      {{ lang.views.watcher.calls_worker[lg] }}
                    </th>

                    <th class="text-left">
                      {{ lang.generic.date[lg] }}
                    </th>

                    <th class="text-left">
                      {{ lang.views.watcher.calls_kind[lg] }}
                    </th>

                    <th class="text-left">
                      {{ lang.generic.start[lg] }}
                    </th>

                    <th class="text-left">
                      {{ lang.generic.end[lg] }}
                    </th>

                    <th class="text-left">
                      {{ lang.views.watcher.calls_d27[lg] }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(call, i) in filtered_calls"
                    :key="i"
                    :title="call.name + (call.description ? '\n\n' + call.description : '')"
                  >
                    <td class="px-2" style="width: 210px;">
                      {{ call.profile.name }}
                    </td>

                    <td class="px-2">
                      {{ $tool.format_date(call.date) }}
                    </td>

                    <td class="px-2" style="width: 95px;">
                      {{ call.kind }}
                    </td>

                    <td class="px-2">
                      {{ call.start }}
                    </td>

                    <td class="px-2">
                      {{ call.end }}
                    </td>

                    <td class="px-2">
                      <v-btn
                        small
                        @click="get_d27(call)"
                        :disabled="call.files.length == 0 && call.links.length == 0"
                      >
                        <v-icon>
                          mdi-file-pdf
                        </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>

          <div
            v-else
            class="d-flex justify-center py-16"
            style="width: 540px;"
          >
            {{ lang.views.watcher.calls_no_call[lg] }}
          </div>
        </div>
      </v-card>
    </div>
  </transition>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'

export default {
  name: 'Calls',

  components: {
    NavigationBar,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      calls: Array(),
      tab: null,
      with_d27: false,
    }
  },

  async created() {
    this.request = await this.$http.get('calls', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.calls = this.request.calls

    this.loading = false
  },

  computed: {
    filtered_calls() {
      if (this.tab > 0) {
        let profile = this.visible_profiles[this.tab - 1]

        return this.calls.filter(c => {
          return (c.profile.id == profile.id) && (this.with_d27 ? (c.files.length > 0 || c.links.length > 0) : true)
        })
      }

      return this.calls.filter(c => {
        return this.with_d27 ? (c.files.length > 0 || c.links.length > 0) : true
      })
    },

    visible_profiles() {
      let visible_profiles = Array()

      for (let profile of this.team.profiles) {
        if (this.$has_xs(['watcher_can_see_cells']) || profile.id == this.$logged_profile.id) {
          visible_profiles.push(profile)
        }
      }
      
      return visible_profiles
    },
  },

  methods: {
    get_d27(call) {
      call
    },
  },

  watch: {

  },
}

</script>


<style>

.call-tab.v-tab {
  justify-content: flex-start;
  text-transform: none;
  width: 260px !important;
  max-width: 260px !important;
}

.call-tab.v-tabs {
  justify-content: flex-start;
  text-transform: none;
  width: 260px !important;
  max-width: 260px !important;
}

</style>

<style scoped>

.circle-name {
  position: sticky;
  left: 15px;
  width: calc(100vw - 50px);
  height: 32px;
}

</style>

