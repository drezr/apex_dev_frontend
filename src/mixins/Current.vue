<script>

export default {
  data() {
    return {

    }
  },

  computed: {
    $current_day() {
      if (this.$route.params.day) return this.$route.params.day
      else return new Date().getDate()
    },

    $current_month() {
      if (this.$route.params.month) return this.$route.params.month
      else return new Date().getMonth() + 1
    },

    $current_year() {
      if (this.$route.params.year) return this.$route.params.year
      else return new Date().getFullYear()
    },

    $current_profile() {
      return this.$route.params.profile_id
    },

    $current_app_name() {
      return this.$route.meta.app
    },

    $current_view() {
      return this.$route.meta.view
    },

    $current_component() {
      return this.$route.matched[0].instances.default
    },

    $current_circle_id() {
      return this.$route.params.circle_id
    },

    $current_team_id() {
      return this.$route.params.team_id
    },

    $current_app_id() {
      return this.$route.params.app_id
    },

    $current_instance() {
      return this
    },
  },

  methods: {

  },
}

</script>
