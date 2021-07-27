<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="team-title">
        {{ team.name }}
      </div>

      <NavigationBar
        class="mb-6"
        @open-customize-dialog="customize_dialog = true"
      />

      <div class="works-frame" v-if="works.length > 0">
        <VueDraggable
          v-model="works"
          @change="update_work_position"
          :animation="100"
          easing="cubic-bezier(1, 0, 0, 1)"
          handle=".work-drag-button"
        >
          <Work
            v-for="(work, i) in works"
            :key="i"
            :self="work"
            class="ma-3"
          />
        </VueDraggable>
      </div>

      <div v-else class="d-flex justify-center align-center my-16">
        {{ lang.views.radium.no_works[lg] }}
      </div>
    </div>
  </transition>

  <CustomDialog
    :open="customize_dialog"
    :width="800"
    :title_text="lang.views.radium.customize_tooltip[lg]"
    :title_icon="'mdi-tune-vertical'"
    @cancel="customize_dialog = false"
  >
    <VueDraggable
      v-model="columns"
      @change="update_columns"
      :animation="100"
      easing="cubic-bezier(1, 0, 0, 1)"
      handle=".cursor-move"
    >
      <div
        v-for="(column, i) in columns"
        :key="i"
        class="works-customize-row"
      >
        <v-icon class="cursor-move handle mr-3 pink--text">
          mdi-drag-horizontal-variant
        </v-icon>

        <div style="width: 200px; text-align: center;" class="black--text">
          <b>{{ lang.views.radium['column_title_' + column.name][lg] }}</b>
        </div>

        <v-text-field
          v-model="column.width"
          :label="lang.generic.column_width[lg]"
          type="number"
          class="mx-3"
          outlined
          hide-details
        />

        <v-text-field
          v-model="column.textsize"
          :label="lang.generic.text_size[lg]"
          type="number"
          class="mx-3"
          outlined
          hide-details
        />

        <v-checkbox
          v-model="column.visible"
          :label="lang.generic.visible[lg]"
          class="mx-3"
          hide-details
          style="position: relative; top: -10px;"
        ></v-checkbox>
      </div>
    </VueDraggable>
  </CustomDialog>

</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import Work from '@/views/radium/components/Work.vue'

export default {
  name: 'Works',

  components: {
    NavigationBar,
    Work,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      cached_teams: Array(),
      circles_loading: true,
      circles: Array(),
      customize_dialog: false,
      team: Object(),
      app: Object(),
      config: Object(),
      works: Array(),
      columns: Array(),
    }
  },

  async created() {
    this.request = await this.$http.get('works', {
      'team_id': this.$current_team_id,
      'app_id': this.$current_app_id,
      'month': this.$current_month,
      'year': this.$current_year,
    })

    this.team = this.request.team
    this.app = this.request.app
    this.config = this.request.config
    this.works = this.request.works
    this.columns = this.get_columns()

    this.loading = false

    this.request = await this.$http.get('apps')
    this.circles = this.request.circles

    for (let circle of this.circles) {
      circle.teams.sort((a, b) => a.name.localeCompare(b.name))

      for (let team of circle.teams) {
        team.apps.sort((a, b) => {
          a = a.name || ''
          b = b.name || ''
          
          return a.localeCompare(b)
        })
      }
    }

    this.circles_loading = false
  },

  computed: {

  },

  methods: {
    update_work_position() {

    },

    get_columns() {
      let columns = Array()

      for (let key in this.config) {
        for (let value of ['visible', 'width', 'position', 'textsize']) {
          if (key.includes(value)) {
            let name = key.replace('_' + value, '')
            let item = columns.find(i => i.name == name)

            if (!item) {
              item = {'name': name}
              columns.push(item)
            }

            item[value] = this.config[key]
            break
          }
        }
      }

      columns.sort((a, b) => a.position - b.position)

      return columns
    },

    update_columns() {

    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.works-frame {

}

.works-customize-row {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px grey solid;
  padding-bottom: 10px;
}

</style>
