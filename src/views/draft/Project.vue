<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title">
        {{ project.name }}
      </div>

      <div class="project-title-chips">
        <v-chip class="white--text grey darken-1" small>
          {{ $tool.format_date(project.date) }}
        </v-chip>

        <v-chip
          class="white--text ml-2"
          :color="project.archived ? 'light-blue' : 'green'"
          small
        >
          {{ project.archived ? lang.views.draft.archived[lg] : lang.views.draft.ongoing[lg] }}
        </v-chip>

        <v-chip
          class="white--text ml-2"
          :color="project.private ? 'indigo' : 'deep-purple'"
          small
        >
          {{ project.private ? lang.views.draft.private[lg] : lang.views.draft.public[lg] }}
        </v-chip>
      </div>

      <v-card
        class="mx-auto mb-5 pa-2 d-flex justify-space-around"
        max-width="600"
      >
        <CustomButton
          v-if="$xs.draft_is_editor || $is_staff"
          :tooltip="lang.generic.models[lg]"
          :icon="'mdi-webpack'"
          :outlined="true"
        ></CustomButton>

        <CustomButton
          :tooltip="lang.generic.filter[lg]"
          :icon="'mdi-filter'"
          :color="'black'"
          :dark="show_filters"
          :outlined="!show_filters"
          @click="show_filters = !show_filters"
        ></CustomButton>

        <CustomButton
          :tooltip="lang.generic.sort[lg]"
          :icon="'mdi-sort'"
          :color="'black'"
          :dark="show_sorts"
          :outlined="!show_sorts"
          @click="show_sorts = !show_sorts"
        ></CustomButton>

        <CustomButton
          :tooltip="lang.generic.printable_version[lg]"
          :icon="'mdi-printer'"
          :outlined="true"
          @click="go_printable"
        ></CustomButton>

        <CustomButton
          v-if="$xs.draft_is_manager || $is_staff"
          :tooltip="lang.views.draft.edit_project[lg]"
          :icon="'mdi-rename-box'"
          :outlined="true"
          @click="edit_dialog = true"
        ></CustomButton>
      </v-card>

      <div
        class="project-filter-sort-frame"
        v-if="show_filters"
        :class="show_sorts ? 'mb-3' : ''"
      >
        <div class="mb-3"><b>Filtrer les tâches</b></div>

        <v-autocomplete
          v-for="(items, name) in available_filters"
          :key="name"
          :label="name"
          :items="items"
          v-model="enabled_filters[name]"
          :no-data-text="lang.generic.no_result[lg]"
          prepend-icon="mdi-filter"
          outlined
          hide-details
          class="py-2"
          chips
          deletable-chips
          small-chips
          dense
          multiple
        ></v-autocomplete>
      </div>


      <div class="project-filter-sort-frame" v-if="show_sorts">
        <div class="mb-3"><b>Trier les tâches</b></div>

        <v-select
          v-model="selected_sort"
          :items="available_sorts"
          item-text="name"
          item-value="value"
          label="Trier par"
          prepend-icon="mdi-sort"
          hide-details
          outlined
          class="py-2"
        ></v-select>
      </div>

      <v-card class="mx-auto my-6 pb-1" max-width="600">
        <v-toolbar color="deep-purple" class="elevation-1" dark>
          <v-toolbar-title>
            <v-icon x-large class="mr-3">
              mdi-clipboard-check-multiple-outline
            </v-icon>

            {{ lang.generic.tasks[lg] }}
          </v-toolbar-title>
        </v-toolbar>

        <VueDraggable
          v-model="computed_tasks"
          @change="update_position"
          :animation="100"
          easing="cubic-bezier(1, 0, 0, 1)"
          handle=".handle"
        >
          <Task
            v-for="(task, i) in computed_tasks"
            :key="i"
            :self="task"
            :parent="project"
            class="mx-1 my-2"
          />
        </VueDraggable>

        <div 
          v-if="Object.keys(enabled_filters).length == 0 && computed_tasks.length == 0"
          class="text-center ma-6"
        >
          {{ lang.views.draft.tip_no_task_1[lg] }}<br>
          <small>{{ lang.views.draft.tip_no_task_2[lg] }}</small>
        </div>

        <div 
          v-if="Object.keys(enabled_filters).length > 0 && computed_tasks.length == 0"
          class="text-center ma-12"
        >
          {{ lang.views.draft.tip_no_filtered_task[lg] }}
        </div>
      </v-card>

      <div class="d-flex justify-end" v-if="has_access">
        <div class="project-command-buttons-position command-buttons-bg">
          <CustomButton
            v-if="detail_edit_mode"
            :icon="'mdi-plus'"
            :fab="true"
            :color="'green'"
            :dark="true"
            :elevation="1"
            :tooltip="lang.views.draft.add_task[lg]"
            class="mr-2"
            @click="add_task"
            :tooltip_top="true"
          />

          <CustomButton
            :icon="'mdi-pencil'"
            :fab="true"
            :color="'teal'"
            :dark="true"
            :elevation="1"
            :tooltip="detail_edit_mode ? lang.views.draft.disable_edit_mode[lg] :lang.views.draft.enable_edit_mode[lg]"
            :outlined="detail_edit_mode"
            @click="detail_edit_mode = !detail_edit_mode"
            :tooltip_top="true"
          />
        </div>
      </div>
    </div>
  </transition>

  <CustomDialog
    v-if="edit_dialog"
    :open="edit_dialog"
    :width="500"
    :title_text="lang.views.draft.edit_project[lg]"
    :title_bg_color="'teal lighten-4'"
    @cancel="edit_dialog = false"
    :cancel_icon="'mdi-close'"
    :cancel_text="lang.generic.cancel[lg]"
    :confirm_icon="'mdi-content-save'"
    :confirm_text="lang.generic.save[lg]"
    :confirm_color="'teal'"
    @confirm="edit_project"
  >
    <v-text-field
      v-model="edit_project_name"
      :label="lang.views.draft.project_name[lg]"
      outlined
      class="mt-6"
    ></v-text-field>

    <v-dialog
      ref="dialog"
      v-model="date_dialog"
      width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :value="$tool.format_date(edit_project_date)"
          :label="lang.views.draft.project_date[lg]"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
          outlined
          hide-details
        ></v-text-field>
      </template>

      <v-date-picker
        v-model="edit_project_date"
        :first-day-of-week="1"
        locale="fr-fr"
        scrollable
        no-title
        @input="date_dialog = false"
        class="py-6"
      ></v-date-picker>
    </v-dialog>

    <div class="mx-3 mt-6 mb-3">
      <v-checkbox
        v-model="edit_project_private"
        :label="lang.views.draft.private[lg]"
        :hint="lang.views.draft.private_hint[lg]"
        persistent-hint
      ></v-checkbox>

      <v-checkbox
        v-model="edit_project_archived"
        :label="lang.views.draft.archived[lg]"
        :hint="lang.views.draft.archived_hint[lg]"
        persistent-hint
      ></v-checkbox>
    </div>
  </CustomDialog>
</div>

</template>


<script>

import Task from '@/components/Task.vue'

export default {
  name: 'Project',

  components: {
    Task,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      project: Object(),
      detail_edit_mode: false,
      show_filters: false,
      enabled_filters: Object(),
      show_sorts: false,
      selected_sort: null,
      edit_dialog: false,
      date_dialog: false,
      edit_project_name: null,
      edit_project_date: null,
      edit_project_private: null,
      edit_project_archived: null,
    }
  },

  async created() {
    this.request = await this.$http.get('project', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'project_id': this.$current_project_id,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.project = this.request.project

    this.edit_project_name = this.$tool.deepcopy(this.project.name)
    this.edit_project_date = this.$tool.deepcopy(this.project.date)
    this.edit_project_private = this.$tool.deepcopy(this.project.private)
    this.edit_project_archived = this.$tool.deepcopy(this.project.archived)

    let children = this.$tool.get_fused_children(this.project)
    children = this.$tool.deepcopy(children)
    this.$set(this.project, 'children', children)

    this.loading = false
  },

  computed: {
    has_access() {
      return this.$has_xs(['draft_is_editor']) || this.$current_view == 'myapexproject'
    },

    available_filters() {
      let filters = Object()

      filters[this.lang.views.draft.task_name[this.lg]] = Array()
      filters[this.lang.views.draft.task_status[this.lg]] = Array()

      for (let task of this.project.children) {
        if (!filters[this.lang.views.draft.task_status[this.lg]].includes(task.status)) {
          filters[this.lang.views.draft.task_status[this.lg]].push(this.status_description(task.status))
        }

        if (task.name && !filters[this.lang.views.draft.task_name[this.lg]].includes(task.name)) {
          filters[this.lang.views.draft.task_name[this.lg]].push(task.name)
        }

        for (let child of task.children) {
          if (child.type == 'input') {
            if (child.key && child.value) {
              if (!(child.key in filters)) {
                filters[child.key] = Array()
              }

              if (child.value && child.value.length > 0) {
                filters[child.key].push(child.value)
              }
            }
          }
        }
      }

      return filters
    },

    available_sorts() {
      let sorts = Array()
      let names = Object.keys(this.available_filters)

      sorts.push({
        'name': this.lang.views.draft.initial_order[this.lg],
        'value': null,
      })

      sorts.push({
        'name': this.lang.views.draft.task_name[this.lg],
        'value': 'name',
      })

      for (let name of names) {
        if (name != this.lang.views.draft.task_name[this.lg]) {
          sorts.push({
            'name': name,
            'value': name,
          })
        }
      }

      return sorts
    },

    computed_tasks: {
      get() {
        let tasks = this.project.children

        // Filtering

        for (let name in this.enabled_filters) {
          let values = this.enabled_filters[name]

          if (values && values.length > 0) {
            tasks = tasks.filter(task => {
              if (name == this.lang.views.draft.task_status[this.lg]) {
                return values.includes(this.status_description(task.status))
              }

              else if (name == this.lang.views.draft.task_name[this.lg]) {
                return values.includes(task.name)
              }

              else {
                return task.children.find(child => {
                  return child.key == name && values.includes(child.value)
                })
              }
            })
          }
        }

        // Sorting

        let name = this.selected_sort ? this.selected_sort : null

        if (name && name != this.lang.views.draft.task_status[this.lg] && name != 'name') {
          tasks.sort((a, b) => {
            let child_a = a.children.find(c => c.name == name)
            let child_b = b.children.find(c => c.name == name)

            if (child_a && child_b) {
              if (child_a.kind == 'date' && child_b.kind == 'date') {
                let date_a = new Date(child_a.value)
                let date_b = new Date(child_b.value)

                return date_a > date_b ? 1 : -1
              }

              else if (isNaN(child_a.value + child_b.value)) {
                return (child_a.value).localeCompare(child_b.value)
              }

              return child_a.value - child_b.value
            }

            else if (!child_a) {
              return 1
            }

            else if (!child_b) {
              return -1
            }
          })
        }

        else if (name && name == this.lang.views.draft.task_status[this.lg]) {
          tasks.sort((a, b) => {
            return (b.status).localeCompare(a.status)
          })
        }

        else if (name && name == 'name') {
          tasks.sort((a, b) => {
            return (a.name).localeCompare(b.name)
          })
        }

        else {
          tasks.sort((a, b) => {
            return a.link.position - b.link.position
          })
        }

        return tasks
      },

      set(list) {
        for (let child of list) {
          child.link.position = list.indexOf(child)
        }
      },
    },
  },

  methods: {
    update_position() {

    },

    go_printable() {

    },

    add_task() {
      let main_frame = document.getElementById('main-frame')
      main_frame.scrollTo(0, main_frame.scrollHeight)
    },

    status_description(status) {
      if (status == 'pending') return this.lang.generic.pending[this.lg]
      else if (status == 'working') return this.lang.generic.working[this.lg]
      else if (status == 'done') return this.lang.generic.done[this.lg]
      else if (status == 'canceled') return this.lang.generic.canceled[this.lg]
    },

    edit_project() {
      this.edit_dialog = false

      this.project.name = this.edit_project_name
      this.project.date = this.edit_project_date
      this.project.private = this.edit_project_private
      this.project.archived = this.edit_project_archived
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.project-command-buttons-position {
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.project-title-chips {
  display: flex;
  justify-content: center;
  position: relative;
  top: -20px;
}

.project-filter-sort-frame {
  border: 1px black solid;
  border-radius: 5px;
  padding: 10px;
  width: 400px;
  margin: auto;
}

</style>
