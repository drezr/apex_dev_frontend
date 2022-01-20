<template>

<div>
  <div v-if="$current_view == 'calendar'">
    <v-chip
      v-for="(teammate, i) in $get_sorted_teammates(self.teammates)"
      :key="i"
      class="mb-1 mr-1 pl-2 lighten-4"
      :color="teammate.color"
      small
    >
      <v-icon size="22" class="mr-2">mdi-account-circle</v-icon>

      {{ teammate.name }}
    </v-chip>
  </div>

  <div v-if="!$current_component.simplified || $current_component.simplified == false">
    <v-card
      :color="self.work.color + ' darken-1'"
      class="mb-1 pa-1 d-flex justify-space-between align-center"
      dark
    >
      <div class="ml-2">
        <b>{{ lang.generic.shift[lg] }}: {{ self.shift.shift ? self.shift.shift : '---' }}</b>
      </div>

      <div>
        <CustomButton
          :disabled="ilts.length == 0"
          :icon="'mdi-file-pdf'"
          :text="lang.generic.ilt[lg]"
          :small="true"
          :menus="ilts_list"
          @menu_action="get_file($event)"
          class="mr-1"
        />

        <CustomButton
          :disabled="bnxs.length == 0"
          :icon="'mdi-file-pdf'"
          :text="lang.generic.bnx[lg]"
          :small="true"
          :menus="bnxs_list"
          @menu_action="get_file($event)"
        />
      </div>
    </v-card>

    <v-card
      :color="self.work.color + ' lighten-4'"
      class="d-flex pa-2 align-center"
    >
      <img :src="$tool.get_logo('radium_50x50')" class="mr-6" />

      <div class="work-simple-description">
        {{ description }}

        <div v-if="self.description">
          <v-divider class="my-3"></v-divider>
          {{ self.description }}
        </div>
      </div>
    </v-card>
  </div>

  <div v-else>
    <v-card
      :color="self.work.color + ' lighten-4'"
      class="mb-1 pa-1 d-flex justify-space-between align-center"
    >
      <img :src="$tool.get_logo('radium_30x30')" class="mr-6" />

      <div class="work-simple-description" style="font-size: 14px;">
        {{ description }}

        <div v-if="self.description">
          <v-divider class="my-1"></v-divider>
          {{ self.description }}
        </div>
      </div>
    </v-card>
  </div>
</div>

</template>


<script>

export default {
  name: 'PartSimple',

  components: {
    
  },

  props: {
    self: Object,
    parent: Object,
  },

  data() {
    return {

    }
  },

  created() {
    
  },

  computed: {
    ilts() {
      return this.self.work.files.filter(f => f.kind == 'ilt')
    },

    ilts_list() {
      let list = Array()

      for (let ilt of this.ilts) {
        list.push({
          'icon': this.$tool.get_file_icon(ilt.extension),
          'name': ilt.name,
          'color': 'black',
          'action': ilt,
        })
      }

      return list
    },

    bnxs() {
      return this.self.work.files.filter(f => f.kind == 'bnx')
    },

    bnxs_list() {
      let list = Array()

      for (let bnx of this.bnxs) {
        list.push({
          'icon': this.$tool.get_file_icon(bnx.extension),
          'name': bnx.name,
          'color': 'black',
          'action': bnx,
        })
      }

      return list
    },

    description() {
      let desc = this.self.work.work_columns.find(f => f.name == 'description')

      return !desc ? '' : desc.value
    }
  },

  methods: {
    get_file(file) {
      window.open(`${this.$http.media}${file.uid}/${file.name}${file.extension ? '.' + file.extension : ''}`)
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.work-simple-description {
  font-size: 16px;
  white-space: pre-line;
  padding: 2px;
  flex-grow: 1;
}

</style>
