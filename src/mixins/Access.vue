<script>

export default {
  data() {
    return {

    }
  },

  computed: {
    $logged_profile() {
      return this.$store.state.logged_profile
    },

    $xs() {
      if (this.$logged_profile) {
        if (this.$current_component && 
            this.$current_component.request && 
            this.$current_component.request.team) {
          let profile = this.$current_component.request.team.profiles.find(
            p => p.id == this.$logged_profile.id
          )

          return profile ? profile.link : {}
        }
      }

      return {}
    },

    $is_staff() {
      if (this.$logged_profile) {
        return this.$logged_profile.is_staff
      }

      return false
    },
  },

  methods: {
    $has_xs(xs_list) {
/*      if (this.$is_staff) {
        return true
      }*/

      for (let xs of xs_list) {
        if (this.$xs[xs] == true) {
          return true
        }
      }

      return false
    },
  },
}

</script>
