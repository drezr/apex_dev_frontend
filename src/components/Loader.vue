<template>

<div
  class="loader-frame"
  :class="[
    left ? 'justify-start' : '',
    right ? 'justify-end' : '',
  ]"
>
  <v-progress-circular
    :size="size"
    :width="width"
    color="blue"
    indeterminate
    :style="`margin-top: ${mt}px; margin-bottom: ${mb}px;`"
  ></v-progress-circular>
</div>

</template>


<script>

export default {
  name: 'Loader',

  components: {
    
  },

  props: {
    size: Number,
    width: Number,
    mt: {
      type: Number,
      default: 0,
    },
    mb: {
      type: Number,
      default: 0,
    },
    left: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {

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

.loader-frame {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
