<template>

<v-card>
  <v-card-title class="teal white--text">
    <div class=" d-flex flex-no-wrap">
      <v-icon class="mr-3 white--text">mdi-account-outline</v-icon>
      {{ this.lang.views.team.access_manager_edit[this.lg] }} {{ profile.name }}
    </div>
  </v-card-title>

  <div class="pa-3">
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
    ></v-text-field>

    <div class="text-center">
      <CustomButton
        :color="'blue'"
        :dark="true"
        :block="true"
        :icon="'mdi-lock-plus'"
        :text="lang.views.team.access_reset_password[lg]"
        class="mb-6"
        @click="password_dialog = true"
      ></CustomButton>
    </div>

    <v-checkbox
      v-model="copy.link.is_manager"
      :label="lang.views.team.access_is_manager[lg]"
      :hint="lang.views.team.access_is_manager_hint[lg]"
      persistent-hint
      class="mt-0 mb-6 mx-3"
    ></v-checkbox>


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
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.draft_is_user"
            :label="lang.views.team.access_draft_is_user[lg]"
            :hint="lang.views.team.access_draft_is_user_hint[lg]"
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

          <v-checkbox
            v-model="copy.link.watcher_can_see_cells"
            :label="lang.views.team.access_watcher_can_see_cells[lg]"
            :hint="lang.views.team.access_watcher_can_see_cells_hint[lg]"
            persistent-hint
          ></v-checkbox>

          <v-checkbox
            v-model="copy.link.watcher_can_see_quotas"
            :label="lang.views.team.access_watcher_can_see_quotas[lg]"
            :hint="lang.views.team.access_watcher_can_see_quotas_hint[lg]"
            persistent-hint
          ></v-checkbox>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>

  <v-card-actions>
    <v-spacer></v-spacer>

    <CustomButton
      @click="delete_dialog = true"
      :color="'purple'"
      :dark="true"
      :icon="'mdi-account-remove'"
      :text="lang.generic.remove[lg]"
      class="mr-3"
    ></CustomButton>

    <CustomButton
      @click="save"
      :color="'teal'"
      :dark="can_save"
      :icon="'mdi-content-save'"
      :text="lang.generic.save[lg]"
      :disabled="!can_save"
    ></CustomButton>
  </v-card-actions>


  <v-dialog v-model="password_dialog" max-width="495">
    <v-card>
      <v-card-title class="mb-6" style="word-break: keep-all;">
        {{ lang.views.team.access_password_dialog_title[lg] }}
      </v-card-title>

      <v-alert type="warning" class="mx-3" icon="mdi-alert" outlined>
        {{ lang.views.team.access_password_dialog_warning[lg] }}
      </v-alert>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="grey darken-3" text @click="password_dialog = false">
          {{ lang.generic.cancel[lg] }}
        </v-btn>

        <v-btn color="blue darken-1 white--text" @click="send_new_password">
          <v-icon class="mr-2">mdi-send</v-icon>
          {{ lang.generic.send[lg] }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <v-dialog v-model="delete_dialog" max-width="495">
    <v-card>
      <v-card-title class="mb-6" style="word-break: keep-all;">
        {{ lang.views.team.access_delete_dialog_title[lg] }}
      </v-card-title>

      <v-alert type="info" class="mx-3" outlined>
        {{ lang.views.team.access_delete_dialog_warning[lg] }}
      </v-alert>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="grey darken-3" text @click="delete_dialog = false">
          {{ lang.generic.cancel[lg] }}
        </v-btn>

        <v-btn color="purple darken-1 white--text" @click="delete_link">
          <v-icon class="mr-2">mdi-account-remove</v-icon>
          {{ lang.views.team.access_remove_access[lg] }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  },

  data() {
    return {
      copy: Object(),
      password_dialog: false,
      delete_dialog: false,

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
        'red accent-4',
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
/*
For save button disabling
*/
    can_save() {
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
      this.delete_dialog = false
      this.$emit('delete_link')
      this.$emit('close')
    },

    save() {
      this.$emit('close')
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
