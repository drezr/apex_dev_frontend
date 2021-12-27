<template>

<v-card
  min-width="350"
  max-width="350"
  class="mr-3 mb-3 elevation-3"
  style="height: fit-content;"
>
  <div class="d-flex justify-space-between flex-wrap">
    <div class="text-h6 pa-3">
     <b>{{ self.team.name }}</b>
    </div>

    <div class="ma-1 d-flex flex-nowrap pb-3">
      <CustomButton
        v-if="edit_mode"
        :icon="'mdi-email-plus'"
        :text_color="'teal'"
        :small_fab="true"
        :tooltip="lang.views.radium.send_team_message[lg]"
        @click="send_message_dialog = true"
      />

      <CustomButton
        v-if="edit_mode"
        :icon="self.locked ? 'mdi-lock' : 'mdi-lock-open'"
        :text_color="self.locked ? 'orange' : 'blue'"
        :small_fab="true"
        :tooltip="self.locked ? lang.views.radium.unlock_part[lg] : lang.views.radium.lock_part[lg]"
        @click="toggle_lock"
      />

      <CustomButton
        v-if="edit_mode"
        :icon="'mdi-delete'"
        :text_color="'red'"
        :small_fab="true"
        :tooltip="lang.views.radium.remove_part[lg]"
        @click="remove_part_dialog = true"
      />
    </div>
  </div>

  <div v-if="participants.length > 0 && (!edit_mode || self.locked)">
    <div class="px-3 pb-3" v-if="self.needs && !self.locked">
     <small>{{ lang.views.radium.part_needs[lg] }} <b>{{ self.needs }}</b></small>
    </div>

    <v-list dense>
      <div class="text-subtitle-2 px-5 mb-3">
        <b>{{ lang.views.radium.participating_profiles[lg] }}</b>
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
            {{ participant.grade }} {{ participant.field }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ participant.phone }}
        </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>

  <div v-if="edit_mode && self.locked" class="my-9 text-center grey--text">
    {{ lang.views.radium.locked_part[lg] }}
  </div>

  <div v-if="edit_mode && !self.locked">
    <v-text-field
      outlined
      clearable
      dense
      :label="lang.generic.needs[lg]"
      v-model="self.needs"
      class="mx-3"
      @input="update_part()"
    ></v-text-field>

    <div
      v-for="(profile, i) in team.profiles"
      :key="i"
      class="d-flex"
    >
      <div
        class="part-available-button"
        :class="is_available(profile.id) ? 'green' : 'red'"
        @click="toggle_profile(profile.id, 'is_available')"
      ></div>

      <v-checkbox
        class="my-0 pa-0"
        :label="profile.name"
        :input-value="participants.find(p => p.id == profile.id)"
        @change="toggle_profile(profile.id, 'is_participant')"
      >
      </v-checkbox>

      <div
        class="part-presence"
        v-if="profile.presence || profile.absence"
      >
        <span
          class="part-presence-cell"
          :class="[
            select_presence_color(profile.presence),
            profile.absence && profile.absence != '' ? 'part-presence-border-right' : ''
          ]"
          v-if="profile.presence && profile.presence != ''"
        >
          {{ profile.presence }}
        </span>

        <span
          class="part-presence-cell"
          :class="[
            select_presence_color(profile.absence),
            profile.presence && profile.presence != '' ? 'part-presence-border-left' : ''
          ]"
          v-if="profile.absence && profile.absence != ''"
        >
          {{ profile.absence }}
        </span>
      </div>
    </div>

    <div class="d-flex mt-3">
      <v-text-field
        outlined
        clearable
        dense
        :label="lang.views.radium.short_override[lg]"
        v-model="short_override"
        class="ml-3"
      ></v-text-field>

      <CustomButton
        v-if="edit_mode"
        :icon="'mdi-send'"
        :text_color="'blue'"
        :small_fab="true"
        :tooltip="lang.generic.override[lg]"
        @click="override_short"
        class="mx-1"
      />
    </div>
  </div>

  <div
    class="d-flex mb-3"
    :class="edit_mode ? '' : 'mt-3'"
  >
    <v-textarea
      v-if="self.description || edit_mode"
      outlined
      clearable
      dense
      :label="lang.views.radium.part_description[lg]"
      persistent-placeholder
      v-model="self.description"
      class="mx-3 part-textarea"
      hide-details
      auto-grow
      rows="1"
      @input="update_part()"
      :disabled="!edit_mode"
    ></v-textarea>
  </div>

  <div class="part-project-frame-outer" v-if="self.project">
    <v-badge
      overlap
      bordered
      color="blue"
      style="width: 100%;"
      icon="mdi-open-in-new"
    >
      <v-card
        class="part-project-frame-inner"
        color="purple darken-4"
        @click="go_to_project"
        dark
      >
        <img :src="$tool.get_logo('draft_30x30')" class="mr-3" />
        {{ self.project.name }}
      </v-card>
    </v-badge>

    <CustomButton
      v-if="edit_mode"
      :icon="'mdi-delete'"
      :text_color="'red'"
      :small_fab="true"
      class="ml-2"
      :tooltip="lang.views.radium.remove_project[lg]"
      @click="remove_project_dialog = true"
    />
  </div>

  <CustomDialog
    :open="remove_part_dialog"
    :width="500"
    :title_text="lang.generic.are_you_sure[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-delete'"
    :confirm_text="lang.generic.delete[lg]"
    :confirm_color="'red'"
    @cancel="remove_part_dialog = false"
    @confirm="remove_part"
  ></CustomDialog>

  <CustomDialog
    :open="remove_project_dialog"
    :width="500"
    :title_text="lang.generic.are_you_sure[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-delete'"
    :confirm_text="lang.generic.delete[lg]"
    :confirm_color="'red'"
    @cancel="remove_project_dialog = false"
    @confirm="remove_project"
  ></CustomDialog>

  <CustomDialog
    :open="send_message_dialog"
    :width="500"
    :title_text="lang.views.radium.send_team_message[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-email-plus'"
    :confirm_text="lang.generic.send[lg]"
    :confirm_color="'teal'"
    @cancel="send_message_dialog = false"
    @confirm="send_message"
  ></CustomDialog>

  <v-snackbar
    v-model="short_override_snackbar"
    :timeout="short_override_timeout"
  >
    {{ lang.views.radium.short_override_confirm[lg] }}
  </v-snackbar>
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
      remove_part_dialog: false,
      remove_project_dialog: false,
      send_message_dialog: false,
      short_override: '',
      short_override_snackbar: false,
      short_override_timeout: 4000,
      team: Object(),
      is_updating: false,
      update_timer: null,
    }
  },

  async created() {
    await this.set_team()
    await this.set_presences()
  },

  computed: {
    cached_teams() {
      return this.$current_component.cached_teams
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
    async set_team() {
      let is_cached = this.cached_teams.find(t => t.id == this.self.team.id)

      if (!is_cached) {
        this.request = await this.$http.get('team', {
          'team_id': this.self.team.id,
        })

        this.request.team.profiles.sort(
          (a, b) => a.link.position - b.link.position)

        this.$current_component.cached_teams.push(this.request.team)

        this.team = this.request.team
      }

      else {
        this.team = this.$tool.deepcopy(is_cached)
      }
    },

    async set_presences() {
      this.request = await this.$http.get('presences', {
        'team_id': this.self.team.id,
        'date': this.self.date,
      })

      for (let presence of this.request.presences) {
        let profile = this.team.profiles.find(p => p.id == presence.profile_id)

        profile.presence = presence.presence
        profile.absence = presence.absence
      }
    },

    is_available(profile_id) {
      let profile = this.availables.find(p => p.id == profile_id)

      return profile && profile.link.is_available ? true : false
    },

    async toggle_profile(profile_id, attr) {
      let profile = this.self.profiles.find(p => p.id == profile_id)

      if (!profile) {
        let request = await this.$http.post('works', {
          'action': 'create_part_profile_link',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'source_type': 'work',
          'source_id': this.self.work.id,
          'parent_type': 'shift',
          'parent_id': this.self.shift.id,
          'element_type': 'part',
          'element_id': this.self.id,
          'profile_id': profile_id,
        })

        profile = request.profile

        this.self.profiles.push(profile)
      }

      profile.link[attr] = !profile.link[attr]

      await this.$http.post('works', {
        'action': 'update_part_profile_link',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'source_type': 'work',
        'source_id': this.self.work.id,
        'parent_type': 'shift',
        'parent_id': this.self.shift.id,
        'element_type': 'part',
        'element_id': this.self.id,
        'profile_id': profile.id,
        'value': profile.link,
      })
    },

    select_presence_color(value) {
      let color = 'red--text text--accent-4'

      if (value) {
        value = value.toUpperCase()

        if (value.includes('P')) color = 'green--text text--darken-2'
        if (value.includes('PN')) color = 'blue--text text--darken-4'
        if (value.includes('AP')) color = 'red--text text--darken-4'
      }

      return color
    },

    async remove_part() {
      this.remove_part_dialog = false
      this.parent.parts = this.parent.parts.filter(p => p.id != this.self.id)  

      await this.$http.post('works', {
        'action': 'delete_part',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'source_type': 'work',
        'source_id': this.self.work.id,
        'parent_type': 'shift',
        'parent_id': this.self.shift.id,
        'element_type': 'part',
        'element_id': this.self.id,
      })
    },

    async update_part() {
      if (!this.is_updating) {
        clearInterval(this.update_timer)
      }

      this.update_timer = setTimeout(async () => {
        await this.$http.post('works', {
          'action': 'update_part',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'source_type': 'work',
          'source_id': this.self.work.id,
          'parent_type': 'shift',
          'parent_id': this.self.shift.id,
          'element_type': 'part',
          'element_id': this.self.id,
          'value': this.self,
        })
      }, 1000)
    },

    go_to_project() {

    },

    remove_project() {
      this.remove_project_dialog = false
      this.self.project = null
    },

    toggle_lock() {
      this.self.locked = !this.self.locked

      this.update_part()
    },

    send_message() {
      this.send_message_dialog = false
    },

    async override_short() {
      await this.$http.post('works', {
        'action': 'part_override_short',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'source_type': 'work',
        'source_id': this.self.work.id,
        'parent_type': 'shift',
        'parent_id': this.self.shift.id,
        'element_type': 'part',
        'element_id': this.self.id,
        'value': this.short_override,
      })

      this.short_override = ''
      this.short_override_snackbar = true
    },
  },

  watch: {

  },
}

</script>


<style>

.part-textarea textarea:disabled {
  color: black !important;
}

.part-textarea textarea {
  padding-top: 3px !important;
  margin-bottom: 3px !important;
}

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

.part-presence {
  position: relative;
  top: -1px;
  display: inline-flex;
  text-transform: uppercase;
  font-weight: bold;
  margin-left: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  height: 27px;
}

.part-presence-cell {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.part-presence-border-left {
  border-left: 1px rgba(0, 0, 0, 0.2) solid;
}

.part-presence-border-right {
  border-right: 1px white solid;
}

.part-project-frame-outer {
  padding: 9px;
  display: flex;
  align-items: center;
}

.part-project-frame-inner {
  display: flex;
  align-items: center;
  padding: 6px;
  flex-grow: 1;
  cursor: pointer;
}

.part-project-frame-inner:hover {
  filter: brightness(1.2);
}

</style>
