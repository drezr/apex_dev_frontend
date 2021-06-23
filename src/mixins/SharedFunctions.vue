<script>

export default {
  data() {
    return {

    }
  },

  computed: {

  },

  methods: {
    $get_sorted_teammates(teammates) {
      let sorted_teammates = Array()
      let other_teams_profiles = Array()

      for (let teammate of teammates) {
        let profile = this.$current_component.profiles.find(
          p => p.name == teammate)

        if (profile) {
          let exists = sorted_teammates.find(p => p.name == profile.name)

          if (!exists) {
            sorted_teammates.push(profile)
          }
        }

        else {
          other_teams_profiles.push(profile)
        }
      }

      sorted_teammates.sort((a, b) => a.link.position - b.link.position)
      sorted_teammates = sorted_teammates.map(p => p.name)

      return sorted_teammates.concat(other_teams_profiles)
    },
  },
}

</script>
