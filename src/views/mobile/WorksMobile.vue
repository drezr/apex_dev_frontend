<template>

<div class="d-flex flex-column align-center">
  <TimeTravel class="works-mobile-timetravel mt-3 mb-6" />

  <Loader
    v-if="loading"
    class="mt-16"
    :size="70"
  />

  <transition name="fade">
    <div v-if="!loading">
      <div
        v-if="parts.length == 0"
        class="d-flex justify-center align-center my-16"
      >
        {{ lang.views.radium.no_works[lg] }}
      </div>

      <div
        v-for="(part, i) in parts"
        :key="i"
        style="width: 100%; max-width: 500px;"
      >
        <div
          v-if="part.locked"
          class="ml-1 orange--text"
        >
          <v-icon
            class="orange--text mr-1"
            style="position: relative; top: -2px;"
            small
          >
            mdi-lock
          </v-icon>

          <small>{{ lang.views.radium.locked_part[lg] }}</small>
        </div>

        <Part
          :self="part"
          class="px-1"
          style="max-width: 500px; min-width: 371px;"
        />

        <div
          class="d-flex justify-center my-3"
          v-if="!part.locked && !logged_profile_is_participant(part)"
        >
          <CustomButton
            v-if="logged_profile_is_available(part)"
            :text="lang.views.radium.part_set_available[lg]"
            :icon="'mdi-account-check'"
            :text_color="'green'"
            :small="true"
            @click="toggle_profile(part, 'is_available')"
            :disabled="part.toggle_loading"
            :loading="part.toggle_loading"
            style="width: 100%;"
            :block="true"
          />

          <CustomButton
            v-else
            :text="lang.views.radium.part_set_unavailable[lg]"
            :icon="'mdi-account-remove'"
            :text_color="'red'"
            :small="true"
            @click="toggle_profile(part)"
            :disabled="part.toggle_loading"
            :loading="part.toggle_loading"
            style="width: 100%;"
            :block="true"
          />
        </div>

        <div
          v-if="logged_profile_is_participant(part)"
          class="text-center green--text mt-2"
        >
          <v-icon class="green--text" style="position: relative; top: -2px;">
            mdi-account-check
          </v-icon>

          {{ lang.views.mobile.youre_participating[lg] }}
        </div>

        <v-divider class="my-6"></v-divider>
      </div>
    </div>
  </transition>
</div>

</template>


<script>

import TimeTravel from '@/components/TimeTravel.vue'
import Part from '@/components/Part.vue'

export default {
  name: 'WorksMobile',

  components: {
    TimeTravel,
    Part,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      parts: Array(),
      simplified: true,
    }
  },

  async created() {
    let request = await this.$http.get('worksmobile', {
      'profile_id': this.$logged_profile.id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.parts = request.parts

    for (let part of this.parts) {
      this.$set(part, 'toggle_loading', false)
    }

    this.parts.sort((a, b) => a.shift - b.shift)
    this.parts.sort((a, b) => new Date(a.date) - new Date(b.date))

    this.loading = false
  },

  computed: {

  },

  methods: {
    logged_profile_is_available(part) {
      let profile = part.profiles.find(p => p.id == this.$logged_profile.id)

      return !profile ? false : profile.link.is_available
    },

    logged_profile_is_participant(part) {
      let profile = part.profiles.find(p => p.id == this.$logged_profile.id)

      return !profile ? false : profile.link.is_participant
    },

    async toggle_profile(part) {
      part.toggle_loading = true

      let profile = part.profiles.find(p => p.id == this.$logged_profile.id)

      if (!profile) {
        let request = await this.$http.post('worksmobile', {
          'action': 'create_part_profile_link',
          'date': part.date,
          'part_id': part.id,
          'profile_id': this.$logged_profile.id,
        })

        profile = request.profile

        part.profiles.push(profile)
      }

      profile.link.is_available = !profile.link.is_available

      await this.$http.post('worksmobile', {
        'action': 'update_part_profile_link',
        'view': this.$current_view,
        'part_id': part.id,
        'profile_id': profile.id,
        'is_available': profile.link.is_available,
      })

      part.toggle_loading = false
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.works-mobile-timetravel {
  max-width: 350px;
}

</style>
