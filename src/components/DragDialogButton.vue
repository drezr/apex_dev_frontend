<template>

<v-tooltip bottom color="black" v-model="show">
  <template v-slot:activator="{ on, attrs }">
    <div
      class="ml-3 move-button"
      v-bind="attrs"
      v-on="on"
      @mouseup="show = true"
      @mousedown="show = false"
    >
      <v-icon color="pink" class="modal-move">
        mdi-cursor-move
      </v-icon>
    </div>
  </template>
  <span>Déplacer la fenêtre</span>
</v-tooltip>

</template>


<script>

export default {
  name: 'DragDialogButton',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      show: false,
    }
  },

  created() {

  },

  computed: {

  },

  methods: {

  },

  watch: {

  }
}

</script>


<style>

</style>


<style scoped>

.move-button {
  cursor: move;
  border: 1px #E91E63 solid;
  padding: 4px 20px;
  border-radius: 3px;
}

</style>
