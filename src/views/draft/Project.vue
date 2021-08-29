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
          v-model="project.tasks"
          @change="update_position"
          :animation="100"
          easing="cubic-bezier(1, 0, 0, 1)"
          handle=".handle"
        >
          <Task
            v-for="(task, i) in project.tasks"
            :key="i"
            :self="task"
            :parent="project"
            class="mx-1 my-2"
          />
        </VueDraggable>
      </v-card>

      <div class="d-flex justify-end" v-if="$has_xs(['draft_is_editor'])">
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
          />

          <CustomButton
            :icon="'mdi-pencil'"
            :fab="true"
            :color="'teal'"
            :dark="true"
            :elevation="1"
            :tooltip="lang.views.watcher.calendar_edit_elements_tooltip[lg]"
            :outlined="detail_edit_mode"
            @click="detail_edit_mode = !detail_edit_mode"
          />
        </div>
      </div>
    </div>
  </transition>
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
      show_sorts: false,
      edit_dialog: false,
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

    let children = this.$tool.get_fused_children(this.project)
    children = this.$tool.deepcopy(children)
    this.$set(this.project, 'children', children)

    this.loading = false
  },

  computed: {

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

</style>
