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
      if (this.request && this.request.team) {
        let profile = this.request.team.profiles.find(
          p => p.id == this.$logged_profile.id
        )

        return profile.link
      }

      return {}
    },

    $is_staff() {
      return this.$logged_profile.is_staff
    },
  },

  methods: {

  },
}

</script>
