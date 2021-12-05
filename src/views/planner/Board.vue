<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title">
        {{ team.name }}
      </div>

      <NavigationBar
        class="mb-0"
        @open-folders-dialog="folders_dialog = true"
      />

      <div class="d-flex">
        <div class="board-pending-title">
          {{ lang.views.planner.to_be_planned[lg] }}

          <CustomButton
            style="position: relative; top: -2px;"
            class="ml-3"
            :icon="'mdi-plus'"
            :small="true"
            :color="'green'"
            :dark="!add_loading"
            :loading="add_loading"
            :disabled="add_loading"
            :menus="add_menus"
            v-on:menu_action="add_actions($event)"
            :tooltip="lang.views.watcher.calendar_add_element_tooltip[lg]"
            v-if="$is_editor"
          />
        </div>

        <div class="board-planned-title">
          {{ lang.views.planner.planned[lg] }}
        </div>
      </div>

      <div class="d-flex">
        <div style="width: 35%; min-width: 500px;">
          <div class="d-flex justify-center mt-2">
            <div
              v-for="(folder, i) in folders"
              :key="i"
            >
              <v-tooltip
                top
                color="black"
                :disabled="folder.name.length == 0"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-badge
                    bordered
                    dot
                    overlap
                    offset-x="12"
                    offset-y="8"
                    :value="folder.children.length > 0 && selected_folder != folder.link.position"
                    :color="folder.color + ' darken-4'"
                  >
                    <div
                      class="board-tab-button"
                      :class="[
                        folder.color,
                        selected_folder == folder.link.position ? 'board-tab-button-selected' : ''
                      ]"
                      v-bind="attrs"
                      v-on="on"
                      @click="selected_folder = folder.link.position"
                    >
                      {{ folder.link.position + 1 }}
                    </div>
                  </v-badge>
                </template>

                <span>{{ folder.name }}</span>
              </v-tooltip>

              <VueDraggable
                v-model="folder.children"
                group="drag"
                class="board-tab-button-dropzone"
                :style="is_grabbing ? '' : 'pointer-events: none;'"
                v-if="selected_folder != folder.link.position"
                @change="update_children_position($event, folder)"
              />
            </div>
          </div>


          <div class="board-pending">
            <div
              class="lighten-5"
              :class="folders[selected_folder].color"
              style="height: 100%; padding-top: 5px; position: relative; top: -5px;"
            >
              <VueDraggable
                v-model="folders[selected_folder].children"
                @change="update_children_position($event, folders[selected_folder])"
                group="drag"
                :animation="100"
                easing="cubic-bezier(1, 0, 0, 1)"
                handle=".handle"
                style="height: 100%;"
                @start="set_is_grabbing(true)"
                @end="set_is_grabbing(false)"
              >
                <div
                  v-for="(child, i) in folders[selected_folder].children"
                  :key="i"
                >
                  <Task
                    v-if="child.type == 'task'"
                    :self="child"
                    :parent="folders[selected_folder]"
                    class="ma-1"
                  />

                  <Note
                    v-if="child.type == 'note'"
                    :self="child"
                    :parent="folders[selected_folder]"
                    class="ma-1"
                  />

                  <File
                    v-if="child.type == 'file'"
                    :self="child"
                    :parent="folders[selected_folder]"
                    class="ma-1"
                  />
                </div>
              </VueDraggable>
            </div>
          </div>
        </div>

        <div class="board-planned">
          <div
            v-for="(date, i) in dates"
            :key="i"
            class="board-date"
          >
            <div
              class="board-date-day lighten-3"
              :class="get_day_color(date.day_name)"
            >
              <div class="text-center">
                <small>{{ lang.generic[date.day_name][lg].toUpperCase().substring(0,3) }}</small><br>
                <b>{{ date.day }}/{{ date.month }}</b>
              </div>
            </div>

            <div class="board-date-children">
              <div
                v-for="(part, i) in date.data.parts"
                :key="i + $tool.gen_uid()"
                class="board-date-children-frame"
              >
                <div class="board-date-children-child">
                  <Part
                    :self="part"
                    :parent="date.data"
                  />
                </div>

                <div
                  class="board-date-children-teammates"
                  @click="open_teammates_dialog(date.data, part)"
                  :class="!$is_editor ? 'cursor-default' : 'cursor-pointer'"
                >
                  <div
                    v-if="part.teammates.length > 0"
                    class="d-flex justify-center flex-wrap"
                  >
                    <v-chip
                      v-for="(teammate, i) in $get_sorted_teammates(part.teammates)"
                      :key="i"
                      class="mb-1 mr-1 pl-2 lighten-4 cursor-pointer"
                      :color="teammate.color"
                      small
                    >
                      <v-icon size="22" class="mr-2">mdi-account-circle</v-icon>

                      {{ teammate.name }}
                    </v-chip>
                  </div>

                  <div
                    v-else
                    class="d-flex justify-center align-center"
                  >
                    <v-icon>mdi-account-group</v-icon>
                  </div>
                </div>
              </div>

              <VueDraggable
                v-model="date.data.children"
                @change="update_children_position($event, date.data)"
                group="drag"
                :animation="100"
                easing="cubic-bezier(1, 0, 0, 1)"
                handle=".handle"
                @start="set_is_grabbing(true)"
                @end="set_is_grabbing(false)"
                style="
                  height: 100%;
                  position: relative;
                  width: calc(100% + 61px);
                  left: -61px;
                  padding-left: 61px;
                "
              >
                <div
                  v-for="(child, i) in date.data.children"
                  :key="i"
                  class="board-date-children-frame"
                >
                  <div class="board-date-children-child">
                    <Task
                      v-if="child.type == 'task'"
                      :self="child"
                      :parent="date.data"
                    />
                    
                    <Note
                      v-if="child.type == 'note'"
                      :self="child"
                      :parent="date.data"
                    />
                    
                    <File
                      v-if="child.type == 'file'"
                      :self="child"
                      :parent="date.data"
                    />
                  </div>

                  <div
                    class="board-date-children-teammates"
                    @click="open_teammates_dialog(date.data, child)"
                    :class="!$is_editor ? 'cursor-default' : 'cursor-pointer'"
                  >
                    <div
                      v-if="child.teammates.length > 0"
                      class="d-flex justify-center flex-wrap"
                    >
                      <v-chip
                        v-for="(teammate, i) in $get_sorted_teammates(child.teammates)"
                        :key="i"
                        class="mb-1 mr-1 pl-2 lighten-4 cursor-pointer"
                        :color="teammate.color"
                        small
                      >
                        <v-icon size="22" class="mr-2">mdi-account-circle</v-icon>

                        {{ teammate.name }}
                      </v-chip>
                    </div>

                    <div
                      v-else
                      class="d-flex justify-center align-center"
                    >
                      <v-icon>mdi-account-group</v-icon>
                    </div>
                  </div>
                </div>
              </VueDraggable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <CustomDialog
    v-if="teammates_dialog"
    :open="teammates_dialog"
    :width="500"
    :title_text="lang.views.planner.edit_teammates[lg]"
    @cancel="teammates_dialog = false"
  >
    <div class="mt-6" style="width: fit-content; margin: auto;">
      <div
        v-for="(profile, i) in team.profiles"
        :key="i"
        class="d-flex"
      >
        <div
          class="board-task-count"
          :class="get_task_count(profile) == 0 ? 'green' : 'blue'"
        >
          {{ get_task_count(profile) }}
        </div>

        <v-checkbox
          class="my-0 pa-0"
          :label="profile.name"
          :input-value="teammates_object.teammates.find(t => t == profile.name)"
          @change="toggle_teammate(profile)"
        ></v-checkbox>

        <div
          class="board-presence"
          v-if="profile.presence || profile.absence"
        >
          <span
            class="board-presence-cell"
            :class="[
              select_presence_color(profile.presence),
              profile.absence != '' ? 'board-presence-border-right' : ''
            ]"
            v-if="profile.presence && profile.presence != ''"
          >
            {{ profile.presence }}
          </span>

          <span
            class="board-presence-cell"
            :class="[
              select_presence_color(profile.absence),
              profile.presence != '' ? 'board-presence-border-left' : ''
            ]"
            v-if="profile.absence && profile.absence != ''"
          >
            {{ profile.absence }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="foreign_profiles.length > 0"
      style="width: fit-content; margin: auto;"
      class="mt-3"
    >
      <div
        v-for="(profile, i) in foreign_profiles"
        :key="i"
        class="board-foreign-profile"
      >
        <v-icon class="mr-3" style="position: relative; top: -1px;">
          mdi-account-circle
        </v-icon>

        <big>{{ profile.name }}</big>

        <CustomButton
          :icon="'mdi-delete'"
          :small_fab="true"
          :color="'red'"
          class="ml-3"
          style="position: relative; top: -2px;"
          @click="delete_foreign_profile(profile)"
        />
      </div>
    </div>

    <div
      class="d-flex align-center mt-6"
      v-if="!all_profiles_loading && teammates_object.type"
    >
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
        :label="lang.views.planner.add_foreign_user[lg]"
        :no-data-text="lang.generic.no_result[lg]"
      ></v-autocomplete>

      <v-btn
        color="green"
        class="ml-3 white--text"
        :disabled="!picked_profile"
        @click="add_foreign_profile()"
      >
        <v-icon class="mr-3">mdi-account-arrow-left</v-icon>
        {{ lang.generic.add[lg] }}
      </v-btn>
    </div>

    <Loader :size="50" :width="5" class="my-6" v-if="all_profiles_loading" />
  </CustomDialog>

  <CustomDialog
    :open="folders_dialog"
    :width="500"
    :title_text="lang.views.planner.folders_setting[lg]"
    :title_icon="'mdi-folder-cog'"
    @cancel="folders_dialog = false"
    :move_window="true"
    :confirm_icon="'mdi-folder-plus'"
    :confirm_color="'green'"
    :confirm_text="lang.views.planner.add_folder[lg]"
    :confirm_disabled="folders.length == 6"
    @confirm="add_folder"
  >
    <VueDraggable
      v-model="folders"
      @change="update_folders_position"
      :animation="100"
      easing="cubic-bezier(1, 0, 0, 1)"
      handle=".cursor-move"
      class="pt-6"
    >
      <div
        v-for="(folder, i) in folders"
        :key="i"
        class="d-flex align-center mt-4"
      >
        <v-icon class="cursor-move handle mr-3 pink--text">
          mdi-drag-horizontal-variant
        </v-icon>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <div
              class="board-folder-color-circle"
              :class="folder.color"
              v-bind="attrs"
              v-on="on"
            ></div>
          </template>

          <div
            class="d-flex flex-wrap white pa-1"
            style="width: 154px; border: 1px rgba(0, 0, 0, 0.3) solid !important;"
          >
            <div
              v-for="(color, x) in folder_colors"
              :key="x"
              class="board-folder-color-circle"
              :class="[
                color,
                color == folder.color ? 'board-folder-color-circle-selected': '',
              ]"
              @click="set_folder_color(color, folder)"
            ></div>
          </div>
        </v-menu>

        <v-text-field
          v-model="folder.name"
          hide-details
          outlined
          class="mx-3"
          :label="lang.views.planner.folder_name[lg]"
        />

        <CustomButton
          :icon="'mdi-folder-remove'"
          :small_fab="true"
          :color="'red'"
          :tooltip="lang.views.planner.delete_folder[lg]"
          :badge="folder.children.length > 0"
          :badge_icon="'mdi-exclamation'"
          :badge_color="'orange'"
          @click="open_delete_folder_dialog(folder)"
          :disabled="folders.length == 1"
        />
      </div>
    </VueDraggable>
  </CustomDialog>

  <CustomDialog
    :open="delete_folder_dialog"
    :width="500"
    :title_text="lang.generic.are_you_sure[lg]"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-delete'"
    :confirm_text="lang.generic.delete[lg]"
    :confirm_color="'red'"
    @cancel="delete_folder_dialog = false"
    @confirm="delete_folder"
  >
    <v-alert
      v-if="delete_folder_dialog && deleting_folder.children.length > 0"
      outlined
      type="warning"
    >
      {{ lang.views.planner.delete_folder_warning[lg] }}
    </v-alert>
  </CustomDialog>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import Part from '@/components/Part.vue'
import Task from '@/components/Task.vue'
import Note from '@/components/Note.vue'
import File from '@/components/File.vue'

export default {
  name: 'Board',

  components: {
    NavigationBar,
    Task,
    Note,
    File,
    Part,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      add_loading: false,
      team: Object(),
      profiles: Array(),
      app: Object(),
      folders: Array(),
      days: Array(),
      dates: Array(),
      detail_edit_mode: true,
      teammates_dialog: false,
      teammates_day: null,
      teammates_object: null,
      all_profiles_loading: true,
      all_profiles: Array(),
      picked_profile: null,
      foreign_profiles: Array(),
      selected_folder: 0,
      is_grabbing: false,
      folders_dialog: false,
      delete_folder_dialog: false,
      deleting_folder: null,
      move_old_parent: null,
      move_new_parent: null,
      update_positions_timer: null,
      folder_colors: [
        'red',
        'pink',
        'purple',
        'deep-purple',
        'indigo',
        'light-blue',
        'cyan',
        'teal',
        'green',
        'light-green',
        'lime',
        'yellow',
        'amber',
        'orange',
        'deep-orange',
        'blue-grey',
      ],
    }
  },

  async created() {
    this.request = await this.$http.get('board', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.profiles = this.request.team.profiles
    this.app = this.request.app
    this.days = this.request.days

    let children = this.$tool.get_fused_children(this.app)
    children = this.$tool.deepcopy(children)
    this.$set(this.app, 'children', children)

    this.folders = this.request.app.children.filter(c => c.type == 'folder')

    let month = new Date(this.$current_year, this.$current_month, 0)
    let day_count = month.getDate()


    for (let i = 1; i <= day_count; i++) {
      let date = new Date(this.$current_year, this.$current_month - 1, i)
      let day_name = date.toLocaleDateString('en-en', {weekday: 'long'}).toLowerCase()
      let m = Number(this.$current_month)

      let day_data = {
        'day_name': day_name,
        'day': i = i > 9 ? i : '0' + i,
        'month': m = m > 9 ? m : '0' + m,
        'year': Number(this.$current_year),
        'data': {
          children: Array(),
          date: `${this.$current_year}-${m}-${i}`,
          type: 'day',
        },
      }

      let day = this.days.find(d => new Date(d.date).getDate() == i)

      if (day) {
        children = this.$tool.get_fused_children(day)
        children = this.$tool.deepcopy(children)
        this.$set(day, 'children', children)
        day.type = 'day'

        day_data.data = day
      }

      this.dates.push(day_data)
    }

    this.loading = false

    let request = await this.$http.get('all_profiles')
    this.all_profiles = request['all_profiles']
    this.all_profiles.sort((a, b) => (a.name).localeCompare(b.name))

    this.set_disabled_profiles()

    this.all_profiles_loading = false
  },

  computed: {
    add_menus() {
      return [
        {
          'icon': 'mdi-clipboard-check',
          'name': this.lang.generic.task[this.lg],
          'color': 'green',
          'action': 'task',
        },
        {
          'icon': 'mdi-chat',
          'name': this.lang.generic.note[this.lg],
          'color': 'text--darken-2 cyan',
          'action': 'note',
        },
        {
          'icon': 'mdi-file',
          'name': this.lang.generic.file[this.lg],
          'color': 'pink',
          'action': 'file',
        },
      ]
    },
  },

  methods: {
    set_is_grabbing(value) {
      this.is_grabbing = value
    },

    async update_children_position(event, parent) {
      if ('removed' in event) {
        this.move_old_parent = parent
      }

      if ('added' in event) {
        this.move_new_parent = parent
      }

      if ('removed' in event) {
        setTimeout(async () => {
          if (this.move_new_parent && this.move_old_parent) {
            let element = event.removed.element

            let result = await this.$http.post('element', {
              'action': 'move',
              'view': this.$current_view,
              'team_id': this.$current_team_id,
              'app_id': this.$current_app_id,
              'parent_type': this.move_old_parent.type,
              'parent_id': this.move_old_parent.id,
              'new_parent_type': this.move_new_parent.type,
              'new_parent_id': this.move_new_parent.id,
              'new_parent_date': this.move_new_parent.date,
              'element_type': element.type,
              'element_id': element.id,
            })

            if (!this.move_new_parent.id && this.move_new_parent.type == 'day') {
              for (let val in result.day) {
                this.move_new_parent[val] = result.day[val]
              }
            }

            if (this.move_new_parent.type == 'folder') {
              element.teammates = Array()
            }
          }

          this.move_old_parent = null
          this.move_new_parent = null
        }, 100)
      }

      let update_positions_timer = setInterval(async () => {
        if (!this.move_old_parent && !this.move_new_parent) {
          clearInterval(update_positions_timer)

          let position_updates = this.$set_position_updates(parent)

          await this.$http.post('element', {
            'action': 'position',
            'view': this.$current_view,
            'team_id': this.$current_team_id,
            'app_id': this.$current_app_id,
            'element_type': parent.type,
            'element_id': parent.id,
            'position_updates': position_updates,
          })
        }
      }, 1)
    },

    get_day_color(day_name) {
      if (day_name == 'saturday') {
        return 'blue'
      }

      else if (day_name == 'sunday') {
        return 'red'
      }

      return 'grey'
    },

    async open_teammates_dialog(day, child) {
      if (this.$is_editor) {
        this.teammates_day = day
        this.teammates_object = child
        this.foreign_profiles = Array()

        this.request = await this.$http.get('presences', {
          'team_id': this.team.id,
          'date': day.date,
        })

        for (let presence of this.request.presences) {
          let profile = this.profiles.find(p => p.id == presence.profile_id)

          profile.presence = presence.presence
          profile.absence = presence.absence
        }

        for (let teammate of this.teammates_object.teammates) {
          if (!this.profiles.find(p => p.name == teammate)) {
            let profile = this.all_profiles.find(p => p.name == teammate)

            if (this.teammates_object.teammates.includes(profile.name)) {
              profile.disabled = true
            }

            this.foreign_profiles.push(profile)
          }
        }

        this.set_disabled_profiles()

        this.teammates_dialog = true
      }
    },

    async toggle_teammate(profile) {
      let is_participant = false

      if (this.teammates_object.teammates.find(t => t == profile.name)) {
        this.teammates_object.teammates = this.teammates_object.teammates.filter(
          t => t !== profile.name)
      }

      else {
        this.teammates_object.teammates.push(profile.name)
        is_participant = true
      }

      await this.$http.post('board', {
        'action': 'update_teammate',
        'view': this.$current_view,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
        'parent_type': this.teammates_day.type,
        'parent_id': this.teammates_day.id,
        'element_type': this.teammates_object.type,
        'element_id': this.teammates_object.id,
        'profile_id': profile.id,
        'value': is_participant,
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

    get_task_count(profile) {
      let children = this.teammates_day.parts.concat(this.teammates_day.children)
      let count = 0

      for (let child of children) {
        if (child.teammates.find(t => t == profile.name)) {
          count++
        }
      }

      return count
    },

    async add_actions(type) {
      this.add_loading = true

      let folder = this.folders[this.selected_folder]

      let request = await this.$http.post('element', {
        'action': 'create',
        'element_type': type,
        'view': this.$current_view,
        'parent_type': folder.type,
        'parent_id': folder.id,
        'team_id': this.$current_team_id,
        'app_id': this.$current_app_id,
      })

      let child = request[type]
      child.children = Array()

      folder.children.push(child)

      this.add_loading = false
    },

    set_disabled_profiles() {
      for (let profile of this.all_profiles) {
        if (this.profiles.map(p => p.id).includes(profile.id) ||
            this.foreign_profiles.map(p => p.name).includes(profile.name)) {
          profile.disabled = true
        }

        else {
          profile.disabled = false
        }
      }
    },

    add_foreign_profile() {
      let profile = this.all_profiles.find(p => p.id == this.picked_profile)

      profile.disabled = true
      this.foreign_profiles.push(profile)
      this.picked_profile = null

      this.teammates_object.teammates.push(profile.name)
    },

    delete_foreign_profile(profile) {
      this.teammates_object.teammates = this.teammates_object.teammates.filter(
        t => t != profile.name)
      this.foreign_profiles = this.foreign_profiles.filter(
        p => p.id != profile.id)

      profile = this.all_profiles.find(p => p.id == profile.id)
      profile.disabled = false
    },

    add_folder() {

    },

    update_folders_position() {
      for (let folder of this.folders) {
        folder.link.position = this.folders.indexOf(folder)
      }
    },

    set_folder_color(color, folder) {
      folder.color = color
    },

    open_delete_folder_dialog(folder) {
      this.deleting_folder = folder
      this.delete_folder_dialog = true
    },

    delete_folder() {
      this.folders = this.folders.filter(f => f.id !== this.deleting_folder.id)

      for (let folder of this.folders) {
        folder.link.position = this.folders.indexOf(folder)
      }

      this.delete_folder_dialog = false
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.board-pending {
  height: calc(100vh - 274px);
  max-height: calc(100vh - 274px);
  min-height: 300px;
  border: 1px black solid;
  border-radius: 5px;
  margin: 0 10px 0px 10px;
  overflow-y: scroll;
}

.board-planned {
  width: 65%;
  min-width: 941px;
  height: calc(100vh - 249px);
  max-height: calc(100vh - 249px);
  min-height: 300px;
  border: 1px black solid;
  border-radius: 5px;
  margin: 10px 10px 0px 10px;
  overflow-y: scroll;
}

.board-pending-title {
  width: 35%;
  min-width: 500px;
  font-weight: bold;
  font-size: 18px;
  padding-top: 10px;
  margin: 0 10px;
  text-align: center;
}

.board-planned-title {
  width: 65%;
  min-width: 880px;
  font-weight: bold;
  font-size: 18px;
  padding-top: 10px;
  margin: 0 10px;
  text-align: center;
}

.board-tab-button {
  position: relative;
  top: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 5px 0px 0px;
  margin: 0px 5px;
  padding-top: 2px;
  width: 60px;
  height: 26px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 0px black;
  box-shadow: inset 0px -3px 5px 0px rgba(0, 0, 0, 0.2);
}

.board-tab-button:hover {
  filter: brightness(1.3);
}

.board-tab-button-selected {
  color: black;
  text-shadow: none;
  top: 0px;
  box-shadow: 0px 0px 0px 1px black,
              inset 0px -20px 20px 0px rgba(255, 255, 255, 0.7);
  filter: brightness(1.2);
  height: 28px;
  margin-bottom: -2px;
}

.board-tab-button-dropzone {
  position: relative;
  left: 2px;
  border: 1px black solid;
  width: 66px;
  height: 30px;
  margin-top: -29px;
  opacity: 0;
}

.board-date {
  display: flex;
  min-height: 87px;
}

.board-date:not(:last-child) {
  border-bottom: 5px rgba(0, 0, 0, 0.6) solid;
}

.board-date-day {
  width: 60px;
  min-width: 60px;
  height: available;
  display: flex;
  justify-content: center;
  align-items: center;
}

.board-date-children {
  flex-grow: 1;
  border-left: 1px black solid;

}

.board-date-children-frame {
  display: flex;
}

.board-date-children-frame:not(:last-child) {
  border-bottom: 1px black solid;
}

.board-date-children-child {
  flex-grow: 1;
  width: 70%;
  min-width: 450px;
  padding: 12px;
}

.board-date-children-teammates {
  flex-grow: 1;
  border-left: 1px black solid;
  width: 30%;
  min-width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  transition: background-color .5s;
  padding: 6px;
}

.board-date-children-teammates:hover {
  background-color: rgba(0, 100, 255, 0.1);
}

.board-presence {
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

.board-presence-cell {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.board-presence-border-left {
  border-left: 1px rgba(0, 0, 0, 0.2) solid;
}

.board-presence-border-right {
  border-right: 1px white solid;
}

.board-task-count {
  position: relative;
  top: -3px;
  left: -10px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.board-foreign-profile:not(:last-child) {
  border-bottom: 1px rgba(0, 0, 0, 0.2) solid;
  margin: 3px;
}

.board-folder-color-circle {
  width: 30px;
  min-width: 30px;
  max-width: 30px;
  height: 30px;
  border-radius: 15px;
  margin: 3px;
  cursor: pointer;
  transition: filter .2s, box-shadow .2s;
}

.board-folder-color-circle:hover {
  filter: brightness(1.3);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, .8);
}

.board-folder-color-circle-selected {
  filter: brightness(1.3);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, .8);
}

</style>
