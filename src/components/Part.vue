<template>

<div>
  <div v-if="$current_view == 'calendar'">
    <v-chip
      v-for="(teammate, i) in $get_sorted_teammates(self.teammates)"
      :key="i"
      class="mb-1 mr-1 px-2 lighten-4"
      :color="teammate.color"
      small
    >
      <v-icon size="22" class="mr-2">mdi-account-circle</v-icon>

      {{ teammate.name }}
    </v-chip>
  </div>

  <v-card
    :color="self.work.color + ' darken-1'"
    class="mb-1 pa-1 d-flex justify-space-between align-center"
    dark
  >
    <div class="ml-2">
      <b>{{ lang.generic.shift[lg] }}: {{ self.shift.shift }}</b>
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
      {{ self.work.description }}
    </div>
  </v-card>

</div>

</template>


<script>

export default {
  name: '',

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
          'icon': 'mdi-file-pdf',
          'name': ilt.name,
          'color': 'black',
          'action': ilt.id,
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
          'icon': 'mdi-file-pdf',
          'name': bnx.name,
          'color': 'black',
          'action': bnx.id,
        })
      }

      return list
    },
  },

  methods: {
    get_file(event) {
      console.log(event)
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
}

</style>
