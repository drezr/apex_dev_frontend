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
        let type = this.$current_component.detail_object.type

        if (type == 'day' || type == 'cell') {
          source_type = type
        }

        else {
          source_type = 'task'
        }
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

    $child_task_component() {
      let component = null
      let parent = this.$parent

      while (parent && !component) {
        if (parent.$options.name === 'Task') {
          component = parent
        }
        
        parent = parent.$parent
      }

      return component
    },

    lg() {
      return this.$store.state.language
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

    $set_position_updates(parent) {
      let position_updates = Array()

      for (let child of parent.children) {
        child.link.position = parent.children.indexOf(child)
      }

      for (let child of parent.children) {
          position_updates.push({
            'element_type': child.type,
            'element_id': child.id,
            'position': child.link.position
          })
      }

      return position_updates
    },

    $remove_tag_from_day_cell() {
      if (this.$current_view == 'calendar' && ['day', 'cell'].includes(this.parent.type)) {
        let day_cell = null

        if (this.parent.type == 'day') {
          let day = this.$current_component.calendar.find(d => d.day.id == this.parent.id)

          if (day) {
            day_cell = day.day
          }
        }

        else if (this.parent.type == 'cell') {
          for (let profile of this.$current_component.profiles) {
            let date = profile.dates.find(
              d => d.type == 'cell' && d.cell.id == this.parent.id)

            if (date) {
              day_cell = date.cell
            }
          }
        }

        if (this.self.type == 'call') {
          let calls = this.parent.children.filter(c => c.type == 'call')

          if (calls.length == 0) {
            day_cell.has_call = false
          }
        }

        else {
          let children_except_call = this.parent.children.filter(
            c => c.type != 'call')

          if (children_except_call.length == 0 && this.parent.parts.length == 0) {
            day_cell.has_content = false
          }
        }
      }
    },

    $get_first_from_current_date() {
      return `${this.$current_year}-${Number(this.$current_month) < 10 ? '0' + this.$current_month : this.$current_month}-01`
    },
  },
}

</script>
