<script>

export default {
  data() {
    return {

    }
  },

  computed: {
    $show_link_badge() {
      let no_badge_views = []

      if (!this.self.link.is_original && 
          !no_badge_views.includes(this.$current_view)) {
        return true
      }

      return false
    },

    $is_in_task() {
      if (this.parent.type == 'task' || this.parent.type == 'template') {
        return true
      }

      return false
    },

    $source_type() {
      let source_type = null

      if (this.$current_view == 'calendar') {
        source_type = this.$current_component.detail_object.type
      }

      else if (this.$current_view == 'project') {
        source_type = 'project'
      }

      else if (this.$current_view == 'board') {
        if (this.parent.type == 'folder') {
          source_type = 'folder'
        }

        else if (this.parent.type == 'day') {
          source_type = 'day'
        }

        else if (this.parent.type == 'task') {
          source_type = 'task'
        }
      }

      return source_type
    },

    $current_day_cell_id() {
      if (this.$current_view == 'calendar') {
        if (this.$current_component.detail_object) {
          if (this.$current_component.detail_object.cell.id) {
            return this.$current_component.detail_object.cell.id
          }

          else if (this.$current_component.detail_object.day.id) {
            return this.$current_component.detail_object.day.id
          }
        }
      }

      else if (this.$current_view == 'board') {
        if (this.parent.type == 'day') {
          return this.parent.id
        }

        else if (this.parent.type == 'task') {
          return this.parent.link.day
        }
      }

      return null
    },

    $current_folder_id() {
      if (this.$current_view == 'board') {
        if (this.parent.type == 'folder') {
          return this.parent.id
        }

        else if (this.parent.type == 'task') {
          return this.parent.link.folder
        }
      }

      return null
    },

    $mobile_breakpoint() {
      return this.$vuetify.breakpoint.smAndUp
    },

    $app_descriptions() {
      return {
        'draft': {
          title: 'Draft',
          desc: this.lang.views.team.draft_desc[this.lg],
          color: 'deep-purple',
        },
        'fleet': {
          title: 'Fleet',
          desc: this.lang.views.team.fleet_desc[this.lg],
          color: 'purple darken-1',
        },
        'planner': {
          title: 'Planner',
          desc: this.lang.views.team.planner_desc[this.lg],
          color: 'deep-orange accent-3',
        },
        'radium': {
          title: 'Radium',
          desc: this.lang.views.team.radium_desc[this.lg],
          color: 'indigo',
        },
        'watcher': {
          title: 'Watcher',
          desc: this.lang.views.team.watcher_desc[this.lg],
          color: 'blue',
        },
        'nexus': {
          title: 'Nexus',
          desc: this.lang.views.team.nexus_desc[this.lg],
          color: 'orange',
        },
      }
    },
  },

  methods: {
    $get_sorted_teammates(teammates) {
      if (!teammates) {
        return Array()
      }
      
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
          other_teams_profiles.push(teammate)
        }
      }

      sorted_teammates.sort((a, b) => a.link.position - b.link.position)
      sorted_teammates = sorted_teammates.map(p => {
        return {'name': p.name, 'color': p.link.watcher_color}
      })

      other_teams_profiles = other_teams_profiles.map(p => {
        return {'name': p, 'color': 'grey'}
      })

      return sorted_teammates.concat(other_teams_profiles)
    },

    $set_is_grabbing(value) {
      this.grab_cursor = value ? 'grabbing' : 'grab'

      this.$store.commit('set_is_grabbing', value)
    },
  },
}

</script>
