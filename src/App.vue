<template>

<div>

</div>

</template>


<script>

// import Component from '@/components/Component.vue'

export default {
  name: '',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {

    }
  },

  async created() {
    console.log(await this.$req.get('team/1/watcher/2/calls/05/2021/'))
  },

  computed: {

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

</style>
