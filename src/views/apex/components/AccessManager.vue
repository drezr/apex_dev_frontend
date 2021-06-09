<template>

<v-card>
  <v-card-title class="teal white--text">
    <v-icon class="mr-3 white--text">mdi-account-group-outline</v-icon>
    {{ lang.views.team.access_manager_tooltip[lg] }}
  </v-card-title>

  <v-card-text>
    <v-btn
      @click="open_profile_editor_dialog(null)"
      class="mt-3 mb-6 green"
      block
      dark
    >
      <v-icon class="mr-3">mdi-account-plus</v-icon>
      {{ lang.views.team.access_create_user[lg] }}
    </v-btn>

    <div class="d-flex align-center mb-3">
      <v-autocomplete
        v-model="picked_profile"
        :items="all_profiles"
        item-text="name"
        item-value="id"
        outlined
        chips
        small-chips
        hide-details
        deletable-chips
        :allow-overflow="false"
        :label="lang.views.team.access_add_existing_user[lg]"
        :no-data-text="lang.generic.no_result[lg]"
      ></v-autocomplete>

      <v-btn
        color="green"
        class="ml-3 white--text"
        :disabled="!picked_profile"
      >
        <v-icon class="mr-3">mdi-account-arrow-left</v-icon>
        {{ lang.generic.add[lg] }}
      </v-btn>
    </div>
  </v-card-text>

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
      :mode="profile_editor_mode"
      @close="profile_editor_dialog = false"
      @delete_link="delete_link"
      @save="save_user"
      @create="create_user"
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
      all_profiles: Array(),
      picked_profile: null,
      profile_editor_mode: null,
    }
  },

  async created() {
    this.profiles = this.$tool.deepcopy(this.team.profiles)
    this.profiles.sort((a, b) => a.link.position - b.link.position)

    let request = await this.$http.get('all_profiles')
    this.all_profiles = request['all_profiles']
    this.all_profiles.sort((a, b) => (a.name).localeCompare(b.name))

    this.set_disabled_profiles()
  },

  computed: {

  },

  methods: {
    update_position() {

    },

    save_user(profile) {
      console.log(profile)
    },

    create_user(profile) {
      console.log(profile)
    },

    open_profile_editor_dialog(profile) {
      if (profile) {
        this.selected_profile = profile
        this.profile_editor_mode = 'edit'
      }

      else {
        this.selected_profile = this.get_dummy_profile()
        this.profile_editor_mode = 'create'
      }
      
      this.profile_editor_dialog = true
    },

    delete_link() {
      this.profiles = this.profiles.filter(
        p => p.id !== this.selected_profile.id
      )

      this.set_disabled_profiles()
    },

    set_disabled_profiles() {
      for (let profile of this.all_profiles) {
        if (this.profiles.map(p => p.id).includes(profile.id)) {
          profile.disabled = true
        }

        else {
          profile.disabled = false
        }
      }
    },

    get_dummy_profile() {
      return {
        'username': '',
        'is_staff': false,
        'name': '',
        'phone': '',
        'ident': '',
        'grade': '',
        'field': '',
        'user': null,
        'link':  {
          'is_manager': false,
          'draft_is_editor': false,
          'draft_is_user': false,
          'draft_can_see_private': false,
          'radium_is_editor': false,
          'watcher_is_editor': false,
          'watcher_is_visible': false,
          'watcher_is_printable': false,
          'watcher_can_see_cells': false,
          'watcher_can_see_quotas': false,
          'watcher_color': 'blue',
          'position': null,
          'profile': null,
          'team': null,
        },
      }
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
