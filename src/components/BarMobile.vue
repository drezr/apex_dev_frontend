<template>

<div class="bar-mobile-frame teal lighten-2">
  <div class="d-flex">
    <div class="d-flex" style="width: 33%;">
      <v-icon
        class="white--text ml-3"
        @click="app.drawer = !app.drawer"
      >
        mdi-menu
      </v-icon>
    </div>
    
    <div
      class="d-flex justify-center"
      style="width: 34%;"
    >
      <img :src="$tool.get_logo('mobile_50x50')" style="margin: 3px;">
    </div>
    
    <div
      class="d-flex"
      style="width: 33%;"
    >
      
    </div>
  </div>
</div>

</template>


<script>

// import Component from '@/components/Component.vue'

export default {
  name: 'BarMobile',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {

    }
  },

  created() {

  },

  computed: {
    app() {
      return this.$parent.$parent
    }
  },

  methods: {

  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.bar-mobile-frame {
  width: 100%;
  height: 56px;
}

</style>
