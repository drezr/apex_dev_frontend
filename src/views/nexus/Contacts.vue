<template>

<div>

</div>

</template>


<script>

// import Component from '@/components/Component.vue'

export default {
  name: 'Contacts',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {

    }
  },

 async created() {
    this.request = await this.$http.get('contacts', {
      'app_id': this.$current_app_id,
      'day': this.$route.params.day,
      'month': this.$route.params.month,
      'year': this.$route.params.year,
    })

    console.log(this.request)
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
