<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading" class="project-printable-area">
      <div class="d-flex justify-center my-1 mx-3 text-h5">
        <CustomButton
          :icon="'mdi-chevron-left'"
          :height="40"
          :outlined="true"
          class="mr-3 no-print"
          @click="$router.push(`/team/${$current_team_id}/draft/${$current_app_id}/projects/`)"
        />

        {{ project.name }} -
        {{ $tool.format_date(project.date) }}

        <CustomButton
          :icon="'mdi-printer'"
          :height="40"
          :outlined="true"
          class="ml-3 no-print"
          @click="print_document"
        />
      </div>

      <div class="mt-6">
        <div
          class="task-frame"
          v-for="(task, i) in project.children"
          :key="i"
        >
          <div class="task">
            <div class="d-flex align-center">
              <v-icon class="mr-3">mdi-circle-outline</v-icon>
            </div>

            <div>
              {{ task.name }}
            </div>
          </div>

          <div
            v-for="(child, x) in task.children.filter(c => c.kind != 'link' && c.kind != 'gps')"
            :key="x"
            >
            <div v-if="child.type == 'input'" class="input">
              <div v-if="child.kind == 'short'" class="input-short">
                <div class="input-short-name">
                  {{ child.key }}
                </div>

                <div class="input-short-value">
                  {{ child.value }}
                </div>
              </div>
              <div v-if="child.kind == 'long'" class="input-long">
                <div class="input-long-name">
                  {{ child.key }}
                </div>

                <div class="input-long-value">
                  {{ child.value }}
                </div>
              </div>
              <div v-if="child.kind == 'title'" class="input-title">
                <div>
                  {{ child.value }}
                </div>
              </div>
              <div v-if="child.kind == 'date'" class="input-short">
                <div class="input-short-name">
                  {{ child.key }}
                </div>

                <div class="input-short-value">
                  {{ $tool.format_date(child.value) }}
                </div>
              </div>
            </div>

            <div v-if="child.type == 'subtask'" class="subtask">
              <div class="d-flex">
                <div>
                  <v-icon class="mr-5">mdi-circle-outline</v-icon>
                </div>
                <div>
                  {{ child.name }}
                </div>
              </div>
            </div>

            <div v-if="child.type == 'note'" class="note">
              <div class="d-flex">
                <div>
                  <v-icon class="mr-5">mdi-chat</v-icon>
                </div>

                <div>
                  {{ child.value }}
                </div>
              </div>

              <div class="note-details">
                Par <b>{{ child.author }}</b> le
                <b>{{ $tool.format_date(child.date) }}</b>
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap">
            <div style="break-inside: avoid;">
              <img
                class="photo"
                v-for="(photo, y) in task.children.filter(c => c.type == 'file' && ['jpg', 'jpeg', 'png', 'gif'].includes(c.extension))"
                :key="y"
                :src="`${$http.media}${photo.uid}/${photo.name}.${photo.extension}`"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>

</template>


<script>


export default {
  name: 'ProjectPrintable',

  components: {

  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      team: Object(),
      app: Object(),
      project: Object(),
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

  },

  methods: {
    print_document() {
      print()
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

@media print {
  .project-printable-area {
    background-color: white;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 15px;
    font-size: 14px;
    line-height: 18px;
  }
}

.task-frame {
  border: 1px black solid;
  margin: auto;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 5px;
  break-inside: avoid;
  max-width: 21cm;
}

.task-frame:first-child {
  break-inside: auto;
}

.task {
  display: flex;
  font-weight: bold;
  font-size: 18px;
  padding: 5px;
  background-color: rgb(230, 230, 230);
  border-radius: 5px;
}

.input {
  border-bottom: 1px lightgrey solid;
  padding-bottom: 5px;
  margin-top: 10px;
  break-inside: avoid;
}

.input-short {
  display: flex;
}

.input-short-name {
  width: 30%;
  font-weight: bold;
  padding: 0 10px;
  white-space: pre-line;
}

.input-short-value {
  width: 70%;
  white-space: pre-line;
}

.input-long-name {
  font-weight: bold;
  margin-bottom: 5px;
  padding: 0 10px;
  white-space: pre-line;
}

.input-long-value {
  padding: 0 10px;
  white-space: pre-line;
}

.input-title {
  font-size: 20px;
  font-weight: bold;
  margin: 5px 5px;
  white-space: pre-line;

}

.subtask {
  border: 1px grey solid;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
  white-space: pre-line;
  break-inside: avoid;
  background-color: rgb(240, 240, 240);
}

.note {
  border: 1px grey solid;
  border-radius: 10px;
  margin: 20px 10px;
  padding: 10px;
  white-space: pre-line;
  break-inside: avoid;
}

.note-details {
  margin-top: 10px;
  font-size: 12px;
  text-align: right;
}

.photo {
  max-width: 48%;
  margin: 5px;
  border-radius: 5px;
}

</style>
