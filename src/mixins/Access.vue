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
      if (this.$current_component && 
          this.$current_component.request && 
          this.$current_component.request.team) {
        let profile = this.$current_component.request.team.profiles.find(
          p => p.id == this.$logged_profile.id
        )

        return profile ? profile.link : {}
      }

      return {}
    },

    $is_staff() {
      return this.$logged_profile.is_staff
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
