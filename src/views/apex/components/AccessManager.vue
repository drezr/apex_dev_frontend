<template>

<v-card>
  <v-card-title class="teal white--text">
    <v-icon class="mr-3 white--text">mdi-account-group-outline</v-icon>
    {{ lang.views.team.access_manager_tooltip[lg] }}
  </v-card-title>

  <v-list>
    <VueDraggable
      v-model="profiles"
      @change="update_position"
      :animation="100"
      easing="cubic-bezier(1, 0, 0, 1)"
      handle=".handle"
    >
      <v-list-item
        v-for="(profile, index) in profiles"
        :key="index + $tool.gen_uid()"
        class="border-bottom"
      >
        <v-icon class="cursor-move handle mr-3 pink--text">
          mdi-drag-horizontal-variant
        </v-icon>

        <v-list-item-content>
          <v-list-item-title v-text="profile.name"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <CustomButton
            @click="open_profile_editor_dialog(profile)"
            :tooltip="lang.views.team.access_manager_edit[lg] + ' ' + profile.name"
            :color="'teal'"
            :icon="'mdi-pencil'"
            :text_color="'white'"
          ></CustomButton>
        </v-list-item-action>
      </v-list-item>
    </VueDraggable>
  </v-list>

  <v-dialog
    v-if="profile_editor_dialog"
    v-model="profile_editor_dialog"
    max-width="550"
  >
    <ProfileEditor
      :profile="selected_profile"
      @close="profile_editor_dialog = false"
      @delete_link="delete_link"
    />
  </v-dialog>
</v-card>

</template>


<script>

import ProfileEditor from '@/views/apex/components/ProfileEditor.vue'

export default {
  name: 'AccessManager',

  components: {
    ProfileEditor,
  },

  props: {
    team: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      profiles: Array(),
      selected_profile: Object(),
      profile_editor_dialog: false,
    }
  },

  async created() {
    this.profiles = this.$tool.deepcopy(this.team.profiles)
    this.profiles.sort((a, b) => a.link.position - b.link.position)
  },

  computed: {

  },

  methods: {
    update_position() {

    },

    open_profile_editor_dialog(profile) {
      this.selected_profile = profile
      this.profile_editor_dialog = true
    },

    delete_link() {
      this.profiles = this.profiles.filter(
        p => p.id !== this.selected_profile.id
      )
    },
  },

  watch: {

  }
}

</script>


<style>

</style>


<style scoped>

.border-bottom:not(:last-child) {
  border-bottom: 1px grey solid;
}

</style>
