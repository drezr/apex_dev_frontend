<template>

<v-card>
  <v-card-title class="white--text" :class="mode == 'edit' ? 'teal' : 'green'">
    <div class=" d-flex flex-no-wrap">
      <v-icon class="mr-3 white--text" v-if="mode == 'edit'">
        mdi-account-outline
      </v-icon>

      <v-icon class="mr-3 white--text" v-if="mode == 'create'">
        mdi-account-plus
      </v-icon>

      <span v-if="mode == 'edit'">
        {{ this.lang.views.team.access_manager_edit[this.lg] }} {{ profile.name }}
      </span>
      <span v-if="mode == 'create'">
        {{ this.lang.views.team.access_create_user[this.lg] }}
      </span>
    </div>
  </v-card-title>

  <div class="pa-3">
    <v-alert type="warning" prominent class="mx-3" outlined dense v-if="mode == 'create'">
      <small>{{ lang.views.team.access_warning_user_exists[lg] }}</small>
    </v-alert>

    <v-text-field
      outlined
      clearable
      dense
      :label="lang.generic.name[lg]"
      v-model="copy.name"
      :rules="not_empty_rule"
      append-outer-icon="mdi-restore"
      @click:append-outer="copy.name = profile.name"
    ></v-text-field>

    <v-text-field
      outlined
      clearable
      dense
      :label="lang.generic.ident[lg]"
      v-model="copy.ident"
      append-outer-icon="mdi-restore"
      @click:append-outer="copy.ident = profile.ident"
    ></v-text-field>

    <v-text-field
      outlined
      clearable
      dense
      :label="lang.generic.phone[lg]"
      v-model="copy.phone"
      append-outer-icon="mdi-restore"
      @click:append-outer="copy.phone = profile.phone"
    ></v-text-field>

    <v-row>
      <v-col cols="7">
        <v-select
          outlined
          dense
          v-model="copy.grade"
          :items="lang.views.team.access_grades[lg]"
          :label="lang.generic.grade[lg]"
        ></v-select>
      </v-col>

      <v-col cols="5">
        <v-text-field
          outlined
          clearable
          dense
          :label="lang.generic.field[lg]"
          v-model="copy.field"
          append-outer-icon="mdi-restore"
          @click:append-outer="copy.field = profile.field"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-text-field
      outlined
      clearable
      dense
      :label="lang.generic.email[lg]"
      v-model="copy.username"
      :rules="email_rules"
      append-outer-icon="mdi-restore"
      @click:append-outer="copy.username = profile.username"
      @input="check_email_exist()"
    ></v-text-field>

    <div class="text-center" v-if="mode == 'edit'">
      <CustomButton
        :color="'blue'"
        :dark="true"
        :icon="'mdi-lock-plus'"
        :text="lang.views.team.access_reset_password[lg]"
        class="mb-6"
        @click="password_dialog = true"
      ></CustomButton>
    </div>

    <div class="d-flex justify-space-between">
      <v-checkbox
        v-model="copy.link.is_manager"
        :label="lang.views.team.access_is_manager[lg]"
        :hint="lang.views.team.access_is_manager_hint[lg]"
        persistent-hint
        class="mt-0 mb-6 mx-3"
      ></v-checkbox>

      <div>
        <CustomButton
          :icon="'mdi-account-check'"
          :tooltip="lang.views.team.access_give_all_access[lg]"
          :color="'green darken-1'"
          :small_fab="true"
          class="mt-2 mr-1"
          @click="swap_access(true)"
        />

        <CustomButton
          :icon="'mdi-account-minus'"
          :tooltip="lang.views.team.access_remove_all_access[lg]"
          :color="'orange darken-1'"
          :small_fab="true"
          class="mt-2"
          @click="swap_access(false)"
        />
      </div>
    </div>


    <v-expansion-panels class="access">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <img :src="$tool.get_logo('draft_30x30')" class="logo" />
          <b>{{ lang.views.team.access_draft_title[lg] }}</b>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-checkbox
            v-model="copy.link.draft_is_editor"
            :label="lang.views.team.access_draft_is_editor[lg]"
            :hint="lang.views.team.access_draft_is_editor_hint[lg]"
            @click="set_lower_access('draft_is_editor', 'draft_is_user')"
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.draft_is_user"
            :label="lang.views.team.access_draft_is_user[lg]"
            :hint="lang.views.team.access_draft_is_user_hint[lg]"
            :disabled="copy.link.draft_is_editor"
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.draft_can_see_private"
            :label="lang.views.team.access_draft_can_see_private[lg]"
            :hint="lang.views.team.access_draft_can_see_private_hint[lg]"
            persistent-hint
          ></v-checkbox>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>


    <v-expansion-panels class="access mt-3">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <img :src="$tool.get_logo('planner_30x30')" class="logo" />
          <b>{{ lang.views.team.access_planner_title[lg] }}</b>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-checkbox
            v-model="copy.link.planner_is_editor"
            :label="lang.views.team.access_planner_is_editor[lg]"
            :hint="lang.views.team.access_planner_is_editor_hint[lg]"
            @click="set_lower_access('planner_is_editor', 'planner_is_user')"
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.planner_is_user"
            :label="lang.views.team.access_planner_is_user[lg]"
            :hint="lang.views.team.access_planner_is_user_hint[lg]"
            :disabled="copy.link.planner_is_editor"
            persistent-hint
          ></v-checkbox>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>


    <v-expansion-panels class="access mt-3">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <img :src="$tool.get_logo('radium_30x30')" class="logo" />
          <b>{{ lang.views.team.access_radium_title[lg] }}</b>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-checkbox
            v-model="copy.link.radium_is_editor"
            :label="lang.views.team.access_radium_is_editor[lg]"
            :hint="lang.views.team.access_radium_is_editor_hint[lg]"
            persistent-hint
          ></v-checkbox>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>


    <v-expansion-panels class="access mt-3">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <img :src="$tool.get_logo('watcher_30x30')" class="logo" />
          <b>{{ lang.views.team.access_watcher_title[lg] }}</b>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <div class="watcher-color-frame">
            <div
              v-for="(color, i) in watcher_colors"
              :key="i"
              @click="pick_color(color)"
              class="watcher-color-pick"
              :class="[
                color,
                copy.link.watcher_color == color ? 'watcher-color-pick-outlined' : '',
              ]"
            ></div>
          </div>

          <v-checkbox
            v-model="copy.link.watcher_is_editor"
            :label="lang.views.team.access_watcher_is_editor[lg]"
            :hint="lang.views.team.access_watcher_is_editor_hint[lg]"
            @click="
              set_lower_access('watcher_is_editor', 'watcher_is_user');
              set_lower_access('watcher_is_editor', 'watcher_can_see_quotas');
              set_lower_access('watcher_is_editor', 'watcher_can_see_cells');
            "
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.watcher_is_user"
            :label="lang.views.team.access_watcher_is_user[lg]"
            :hint="lang.views.team.access_watcher_is_user_hint[lg]"
            :disabled="copy.link.watcher_is_editor"
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.watcher_can_see_quotas"
            :label="lang.views.team.access_watcher_can_see_quotas[lg]"
            :hint="lang.views.team.access_watcher_can_see_quotas_hint[lg]"
            :disabled="copy.link.watcher_is_editor"
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.watcher_can_see_cells"
            :label="lang.views.team.access_watcher_can_see_cells[lg]"
            :hint="lang.views.team.access_watcher_can_see_cells_hint[lg]"
            :disabled="copy.link.watcher_is_editor"
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.watcher_is_visible"
            :label="lang.views.team.access_watcher_is_visible[lg]"
            :hint="lang.views.team.access_watcher_is_visible_hint[lg]"
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.watcher_is_printable"
            :label="lang.views.team.access_watcher_is_printable[lg]"
            :hint="lang.views.team.access_watcher_is_printable_hint[lg]"
            persistent-hint
          ></v-checkbox>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>

  <v-card-actions>
    <v-spacer></v-spacer>

    <CustomButton
      v-if="mode == 'edit' && $logged_profile.is_staff"
      @click="delete_dialog = true"
      :color="'red'"
      :dark="true"
      :icon="'mdi-delete'"
      :text="lang.generic.delete[lg]"
      :badge="true"
      :badge_icon="'mdi-shield-account'"
      class="mr-3"
    ></CustomButton>

    <CustomButton
      v-if="mode == 'edit'"
      @click="remove_dialog = true"
      :color="'purple'"
      :dark="true"
      :icon="'mdi-account-remove'"
      :text="lang.generic.remove[lg]"
      class="mr-3"
    ></CustomButton>

    <CustomButton
      v-if="mode == 'edit'"
      @click="save"
      :color="'teal'"
      :dark="can_save"
      :icon="'mdi-content-save'"
      :text="lang.generic.save[lg]"
      :disabled="!can_save"
    ></CustomButton>

    <CustomButton
      v-if="mode == 'create'"
      @click="create_dialog = true"
      :color="'green'"
      :dark="can_save"
      :icon="'mdi-account-plus'"
      :text="lang.generic.add[lg]"
      :disabled="!can_save"
    ></CustomButton>
  </v-card-actions>

  <CustomDialog
    :open="password_dialog"
    :width="500"
    :title_text="lang.views.team.access_password_dialog_title[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-send'"
    :confirm_text="lang.generic.send[lg]"
    :confirm_color="'blue darken-1'"
    @cancel="password_dialog = false"
    @confirm="send_new_password"
  >
    <v-alert type="warning" class="mt-6" icon="mdi-alert" outlined>
      {{ lang.views.team.access_password_dialog_warning[lg] }}
    </v-alert>
  </CustomDialog>


  <CustomDialog
    :open="remove_dialog"
    :width="500"
    :title_text="lang.views.team.access_delete_dialog_title[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-account-remove'"
    :confirm_text="lang.generic.confirm[lg]"
    :confirm_color="'purple darken-1'"
    @cancel="remove_dialog = false"
    @confirm="delete_link"
  >
    <v-alert type="info" class="mt-6" outlined>
      {{ lang.views.team.access_delete_dialog_warning[lg] }}
    </v-alert>
  </CustomDialog>


  <CustomDialog
    :open="delete_dialog"
    :width="500"
    :title_text="lang.generic.are_you_sure[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-account-remove'"
    :confirm_text="lang.generic.confirm[lg]"
    :confirm_color="'red darken-1'"
    @cancel="delete_dialog = false"
    @confirm="delete_user"
  ></CustomDialog>


  <CustomDialog
    :open="create_dialog"
    :width="500"
    :title_text="lang.views.team.access_confirm_create_user[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-check'"
    :confirm_text="lang.generic.confirm[lg]"
    :confirm_color="'green darken-1'"
    @cancel="create_dialog = false"
    @confirm="create"
  >
    <v-alert type="info" class="mt-6" outlined>
      {{ lang.views.team.access_confirm_create_user_info[lg] }}
    </v-alert>

    <v-checkbox
      v-model="send_password"
      :label="lang.views.team.access_confirm_create_user_send_password[lg]"
      :hint="lang.views.team.access_confirm_create_user_send_password_hint[lg]"
      persistent-hint
      class="mt-0 mb-6 mx-3"
    ></v-checkbox>
  </CustomDialog>
</v-card>

</template>


<script>

export default {
  name: 'ProfileEditor',

  components: {

  },

  props: {
    profile: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      copy: Object(),
      password_dialog: false,
      remove_dialog: false,
      delete_dialog: false,
      create_dialog: false,
      send_password: false,
      is_updating: false,
      update_timer: null,

      not_empty_rule: [
        value => !!value || this.lang.generic.not_empty_field[this.lg],
      ],

      email_rules: [
        value => !!value || this.lang.views.login.error_insert_email[this.lg],
        value => this.$tool.is_valid_email(value) || this.lang.views.login.error_format_email[this.lg],
      ],

      watcher_colors: [
        'blue',
        'cyan',
        'teal',
        'green',
        'yellow darken-1',
        'orange',
        'red',
        'pink',
        'purple',
        'deep-purple',
      ],
    }
  },

  async created() {
    this.copy = this.$tool.deepcopy(this.profile)
  },

  computed: {
    can_save() {
      // Save button disabling
      let is_name_empty = !this.copy.name || this.copy.name.length == 0
      let is_email_empty = !this.copy.username || this.copy.username.length == 0
      let is_email_not_valid = !this.$tool.is_valid_email(this.copy.username)

      return !(is_name_empty || is_email_empty || is_email_not_valid)
    },
  },

  methods: {
    pick_color(color) {
      this.copy.link.watcher_color = color
    },

    send_new_password() {
      this.password_dialog = false
    },

    delete_link() {
      this.remove_dialog = false
      this.$emit('delete_link')
      this.$emit('close')
    },

    async delete_user() {
      await this.$http.post('team', {
        'action': 'delete_user',
        'team_id': this.$current_team_id,
        'profile_id': this.profile.id,
      })

      this.$emit('delete_link')
      this.$emit('close')
    },

    save() {
      this.$emit('close')
      this.$emit('save', this.copy)
    },

    create() {
      this.$emit('close')
      this.copy.send_password = this.send_password
      this.$emit('create', this.copy)
    },

    set_lower_access(upper, lower) {
      if (this.copy.link[upper]) {
        this.copy.link[lower] = true
      }
    },

    swap_access(value) {
      this.copy.link.is_manager = value

      this.copy.link.planner_is_editor = value
      this.copy.link.planner_is_user = value

      this.copy.link.draft_is_editor = value
      this.copy.link.draft_is_user = value
      this.copy.link.draft_can_see_private = value

      this.copy.link.radium_is_editor = value

      this.copy.link.watcher_is_editor = value
      this.copy.link.watcher_is_user = value
      this.copy.link.watcher_is_visible = value
      this.copy.link.watcher_is_printable = value
      this.copy.link.watcher_can_see_cells = value
      this.copy.link.watcher_can_see_quotas = value
    },

    async check_email_exist() {
      if (!this.is_updating) {
        clearInterval(this.update_timer)
      }

      this.update_timer = setTimeout(async () => {
        let request = await this.$http.post('team', {
          'action': 'check_email_exist',
          'view': this.$current_view,
          'team_id': this.$current_team_id,
          'value': this.copy.username,
        })

        console.log(request)
      }, 1000)
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

.access {
  border: 1px rgba(0, 0, 0, 0.3) solid;
}

.watcher-color-frame {
  display: flex;
  justify-content: space-around;
  border:  1px grey solid;
  border-radius: 26px;
  margin-top: 10px;
  margin-bottom: 30px;
}

.watcher-color-pick {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin: 5px 0;
  cursor: pointer;
}

.watcher-color-pick-outlined {
  box-shadow: 0px 0px 0px 10px black;
  transition: box-shadow .2s;
}

.logo {
  position: relative;
  top: -1px;
  left: -10px;
  max-width: 30px;
  max-height: 30px;
}

</style>
