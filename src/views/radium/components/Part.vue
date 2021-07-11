<template>

<v-card
  min-width="350"
  max-width="350"
  class="mr-3 mb-3 elevation-3"
>
  <div class="text-h6 pa-3">
   <b>{{ self.team.name }}</b>
  </div>

  <v-list dense v-if="participants.length > 0 && !edit_mode">
    <div class="text-subtitle-2 px-5 mb-3">
      <b>Agents participants</b>
    </div>

    <v-list-item
      three-line
      v-for="(participant, i) in participants"
      :key="i"
    >
      <v-list-item-icon class="ml-2 mr-5">
        <v-icon class="mt-7">mdi-account-circle</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ participant.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ participant.grade }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          {{ participant.phone }}
      </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>

  <div dense v-if="edit_mode">
    <div
      v-for="(profile, i) in team.profiles"
      :key="i"
      class="d-flex"
    >
      <div
        class="part-available-button"
        :class="availables.find(p => p.id == profile.id) ? 'green' : 'red'"
        @click="toggle_available(profile.id)"
      ></div>

      <v-checkbox
        class="my-0 pa-0"
        :label="profile.name"
        :input-value="participants.find(p => p.id == profile.id)"
        @change="toggle_participant(profile.id)"
      >
      </v-checkbox>

<!--       <div
        class="presence"
        v-if="profile.presence || profile.absence"
      >
        <span
          class="cell"
          :class="[
            select_color(profile.presence),
            profile.absence != '' ? 'border-right' : ''
          ]"
          v-if="profile.presence && profile.presence != ''"
        >
          {{ profile.presence }}
        </span>

        <span
          class="cell"
          :class="[
            select_color(profile.absence),
            profile.presence != '' ? 'border-left' : ''
          ]"
          v-if="profile.absence && profile.absence != ''"
        >
          {{ profile.absence }}
        </span>
      </div> -->
    </div>
  </div>

</v-card>

</template>


<script>

export default {
  name: 'WorkPart',

  components: {
    
  },

  props: {
    self: Object,
    parent: Object,
    parent_cpnt: Object,
  },

  data() {
    return {

    }
  },

  created() {
    //console.log(this.self)
    this.get_team()
  },

  computed: {
    cached_teams() {
      return this.$current_component.cached_teams
    },

    team() {
      return this.cached_teams.find(t => t.id == this.self.team.id)
    },

    participants() {
      return this.self.profiles.filter(p => p.link.is_participant)
    },

    availables() {
      return this.self.profiles.filter(p => p.link.is_available)
    },

    edit_mode() {
      return this.parent_cpnt.parent_cpnt.edit_mode
    },
  },

  methods: {
    // Get team profiles if not in Works view's "cached_teams"
    async get_team() {
      let is_cached = this.cached_teams.find(t => t.id == this.self.team.id)

      if (!is_cached) {
        this.request = await this.$http.get('team', {
          'team_id': this.self.team.id,
        })

        this.request.team.profiles.sort(
          (a, b) => a.link.position - b.link.position)

        this.$current_component.cached_teams.push(this.request.team)
      }
    },

    toggle_available(profile_id) {
      profile_id
    },

    toggle_participant(profile_id) {
      profile_id
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.part-available-button {
  position: relative;
  top: 3px;
  left: 8px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin-left: 5px;
  margin-right: 20px;
  cursor: pointer;
}

</style>
