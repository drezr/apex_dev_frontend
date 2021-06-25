<template>

<div
  class="tooltip-frame"
  :style="`left: ${x}px; top: ${y}px;`"
  ref="frame"
>
  <Loader 
    v-if="loading"
    :size="50"
    :width="6"
  />

  <transition name="fade">
    <div v-if="!loading">

      <div
        v-for="part in parts"
        :key="part.id + $tool.gen_uid()"
        class="tooltip-margin-bottom"
      >
        <div
          v-if="part.teammates.length > 0"
          class="tooltip-teammates"
        >
          <div
            v-for="(teammate, i) in $get_sorted_teammates(part.teammates)"
            :key="i" class="mr-1"
          >
            {{ teammate }}{{ i == part.teammates.length - 2 ? ',' : '' }}
          </div>
        </div>
        <div class="tooltip-child-frame">
          <div class="d-flex justify-center align-center mr-3">
            <img :src="$tool.get_logo('radium_30x30')" />
          </div>

          <div class="mr-2">
            <div>
              <small>
                {{ lang.generic.shift[lg] }} : {{ part.shift.shift }}
              </small>
            </div>
            <div class="white-space-pre">{{ part.work.description }}</div>
          </div>
        </div>
        
      </div>

      <div
        v-for="child in children"
        :key="child.id + $tool.gen_uid()"
        class="tooltip-margin-bottom"
      >
        <div
          v-if="child.type == 'task' && child.teammates.length > 0"
          class="tooltip-teammates"
        >
          <div
            v-for="(teammate, i) in $get_sorted_teammates(child.teammates)"
            :key="i" class="mr-1"
          >
            {{ teammate }}{{ i == child.teammates.length - 2 ? ',' : '' }}
          </div>
        </div>

        <div v-if="child.type == 'task'" class="tooltip-child-frame">
          <div class="d-flex justify-center align-center mr-2">
            <v-icon color="teal">mdi-clipboard-check</v-icon>
          </div>

          <div class="d-flex justify-center align-center mr-2 white-space-pre">
            {{ child.name }}
          </div>
        </div>

        <div v-if="child.type == 'note'" class="tooltip-child-frame">
          <div class="d-flex justify-center align-center mr-2">
            <v-icon color="orange">mdi-chat</v-icon>
          </div>

          <div class="d-flex justify-center align-center mr-2 white-space-pre">
            {{ child.value }}
          </div>
        </div>

        <div v-if="child.type == 'file'" class="tooltip-child-frame">
          <div class="d-flex justify-center align-center mr-2">
            <v-icon color="pink">mdi-file</v-icon>
          </div>

          <div class="d-flex justify-center align-center mr-2 white-space-pre">
            {{ child.name }}
          </div>
        </div>

        <div v-if="child.type == 'call'" class="tooltip-child-frame">
          <div class="d-flex justify-center align-center mr-2">
            <v-icon color="indigo">mdi-hammer-screwdriver</v-icon>
          </div>

          <div class="d-flex justify-center align-center mr-2">
            {{ child.name }} {{ get_call_from_to(child) }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>

</template>


<script>


export default {
  name: 'DayCellTooltip',

  components: {
    
  },

  props: {
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Object,
      required: true,
    },
    offset_x: {
      type: Number,
      required: true,
    },
    offset_y: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      loading: true,
      children: Array(),
      parts: Array(),
      timer: null,
      open_delay: 500,
      y: 0,
    }
  },

  async created() {
    this.timer = setTimeout(async () => {
      if (this.type == 'day') {
        let request = await this.$http.get('day', {
          'team_id': this.$current_team_id,
          'app_id': this.$current_app_id,
          'date': this.date.day.date,
        })

        this.children = this.$tool.get_fused_children(request.day)
        this.children.sort((a, b) => a.link.position - b.link.position)
        this.parts = request.day.parts
        this.parts.sort((a, b) => a.shift.shift.localeCompare(b.shift.shift))
      }

      else if (this.type == 'cell') {
        let request = await this.$http.get('cell', {
          'profile_id': this.date.cell.profile,
          'date': this.date.cell.date,
        })

        this.children = this.$tool.get_fused_children(request.cell)
        this.children.sort((a, b) => a.link.position - b.link.position)
        this.parts = request.cell.parts
        this.parts.sort((a, b) => a.shift.shift.localeCompare(b.shift.shift))
      }

      this.loading = false

      setTimeout(() => this.set_y_position())
    }, this.open_delay)
  },

  mounted() {
    this.set_y_position()
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  computed: {
    x() {
      let scroll_left = document.getElementById('main-frame').scrollLeft

      return this.offset_x - 178 - scroll_left
    },
  },

  methods: {
    set_y_position() {
      let height_delta = window.innerHeight - this.offset_y
      let height_center = window.innerHeight / 2
      let scroll_top = document.getElementById('main-frame').scrollTop

      if (height_delta > height_center) {
        if (this.type == 'day') {
          this.y = this.offset_y + 42 - scroll_top
        }

        else if (this.type == 'cell') {
          this.y = this.offset_y + 76 - scroll_top
        }
      }

      else {
        if (this.type == 'day') {
          this.y = this.offset_y - 2 - this.$refs.frame.offsetHeight - scroll_top
        }

        else if (this.type == 'cell') {
          this.y = this.offset_y - 2 - this.$refs.frame.offsetHeight - scroll_top
        }
      }
    },

    get_call_from_to(call) {
      let txt = this.lang.views.watcher.call_from_to[this.lg]

      txt = txt.replace('@@@', call.start)
      txt = txt.replace('###', call.end)

      return txt
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.tooltip-frame {
  z-index: 4;
  position: fixed;
  background-color: #80D8FF;
  border: 1px #01579B solid;
  color: #003d6e;
  margin-left: 2px;
  width: 400px;
  padding: 5px;
  border-radius: 5px;
  pointer-events: none;
}

.tooltip-child-frame {
  display: flex;
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px #01579B solid;
  color: #003d6e;
  padding: 5px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
}

.tooltip-margin-bottom:not(:last-child) {
  margin-bottom: 5px;
}

.tooltip-teammates {
  display: flex;
  font-size: 11px;
  font-weight: bold;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 1px;
  border-left: 1px #01579B solid;
  border-top: 1px #01579B solid;
  border-right: 1px #01579B solid;
  border-radius: 5px 5px 0px 0px;
  background-color: rgba(255, 255, 255, 0.8);
}

</style>
