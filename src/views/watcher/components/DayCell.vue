<template>

<div>
  <div @mouseover="hover = true" @mouseleave="hover = false" ref="frame">
    <div class="day-container" v-if="type == 'day'">
      <div
        class="day-frame"
        :class="date.is_cv ? 'day-frame-cv' : 'day-frame-default'"
        @click="$emit('open_detail_dialog', date)"
      >
        <div class="day-name">
          {{ date.name_short.toUpperCase() }}
        </div>

        <div
          class="day-number"
          :class="date.day.has_content ? 'day-has-content' : ''"
        >
          {{ date.day_number }}
        </div>
      </div>

      <div class="day-step day-step-week" v-if="date.week_step">
        {{ date.week_step }}
      </div>

      <div class="day-step day-step-cv" v-if="date.cv_step">
        {{ date.cv_step }}
      </div>
    </div>



    <div
      v-if="type == 'cell'"
      class="cell-frame"
      :style="date.cell.color ? 
      `border-color: ${border_colors[date.cell.color]}; border-width: 1px;
       box-shadow: 0 0 0 1px ${border_colors[date.cell.color]};` : '' +
       $current_view != 'myapexcontacts' ? '' : 'max-height: 56px !important; min-height: 56px !important; pointer-events: none;'
      "
      :class="[
        $current_component.palette ? 'cursor-fill' : '',
      ]"
      @click="try_set_color"
    >
      <input
        type="text"
        class="cell-presence"
        v-model="date.cell.presence"
        :class="[
          'cell-presence-' + cell_backgroud,
          select_text_color(date.cell.presence),
          select_text_size(date.cell.presence),
        ]"
        @focus="get_object($event)"
        :disabled="!$is_editor"
        :id="`${x}_${(y * 2)}`"
        @click="set_current_position(0)"
      />

      <input
        type="text"
        class="cell-absence"
        v-model="date.cell.absence"
        :class="[
          'cell-absence-' + cell_backgroud,
          select_text_color(date.cell.absence),
          select_text_size(date.cell.absence),
        ]"
        @focus="get_object($event)"
        :disabled="!$is_editor"
        :id="`${x}_${(y * 2) + 1}`"
        @click="set_current_position(1)"
      />
      
      <div
        v-if="$current_view != 'myapexcontacts'"
        class="cell-short"
        :class="[
          date.cell.has_content ? 'cell-short-has_content' : 'cell-absence-' + cell_backgroud,
          select_short_size(date.cell.short),
        ]"
        @click="$emit('open_detail_dialog', date)"
      >
        {{ date.cell.short }}
      </div>

      <div class="cell-has-call" v-if="date.cell.has_call">
        
      </div>
    </div>
  </div>

  <Tooltip
    v-if="hover && (date[type].has_call || date[type].has_content)"
    :date="date"
    :type="type"
    :offset_x="offset_x"
    :offset_y="offset_y"
  />
</div>

</template>


<script>

import Tooltip from '@/views/watcher/components/Tooltip.vue'

export default {
  name: '',

  components: {
    Tooltip
  },

  props: {
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Object,
      required: false,
    },
    parent_cpnt: {
      type: Object,
      required: false,
    },
    x: {
      type: Number,
      required: false,
    },
    y: {
      type: Number,
      required: false,
    },
  },

  data() {
    return {
      is_requesting: false,
      hover: false,
      is_updating: false,
      update_timer: null,
      border_colors: {
        'white': '#FFFFFF',
        'red': '#D50000',
        'pink': '#E91E63',
        'purple': '#9C27B0',
        'deep-purple': '#673AB7',
        'indigo': '#3F51B5',
        'light-blue': '#03A9F4',
        'cyan': '#00BCD4',
        'teal': '#009688',
        'green': '#4CAF50',
        'light-green': '#8BC34A',
        'lime': '#CDDC39',
        'yellow': '#FFEB3B',
        'amber': '#FFC107',
        'orange': '#FF9800',
        'deep-orange': '#FF5722',
        'brown': '#795548',
        'blue-grey': '#607D8B',
      },
    }
  },

  created() {

  },

  computed: {
    cell_backgroud() {
      if (this.date.is_holiday) return 'holi'
      else if (this.date.name_short == 'sam') return 'sat'
      else if (this.date.name_short == 'dim') return 'sun'
      else return 'week'
    },

    offset_x() {
      return this.$refs.frame.offsetLeft
    },

    offset_y() {
      return this.$refs.frame.offsetTop
    },
  },

  methods: {
    select_text_color(value) {
      let color = 'red--text text--accent-4'

      if (value) {
        if (this.parent_cpnt && this.parent_cpnt.leave_config) {
          let config =this.parent_cpnt.leave_config

          let presence_types = config.leave_types.filter(
            l => l.kind == 'presence'
          )

          for (let presence_type of presence_types) {
            let code = presence_type.code.toUpperCase()
            value = value.toUpperCase()

            if (value.includes(code)) {
              color = `${presence_type.color}--text text--darken-2`
            }
          }
        }
      }

      return color
    },

    select_text_size(value) {
      if (value) {
        if (value.length <= 4) return 'font-size-12'
        else if (value.length == 5) return 'font-size-11'
        else if (value.length == 6) return 'font-size-10'
      }

      return 'font-size-9'
    },

    select_short_size(value) {
      if (value) {
        if (value.length <= 6) return 'font-size-12'
        else if (value.length == 7) return 'font-size-11'
        else if (value.length == 8) return 'font-size-10'
      }

      return 'font-size-9'
    },

    async get_object(event) {
      if (!this.parent_cpnt.palette) {
        event.target.select()
      }

      if (!this.is_requesting) {
        if (this.type == 'cell') {
          if (!this.date.cell.id) {
            this.is_requesting = true

            let request = await this.$http.get('cell', {
              'profile_id': this.date.cell.profile,
              'date': this.date.cell.date,
            })

            for (let key in request.cell) {
              this.date.cell[key] = request.cell[key]
            }

            this.is_requesting = false
          }
        }
      }
    },

    set_current_position(increment) {
      this.parent_cpnt.current_position = [this.x, (this.y * 2) + increment]
    },

    async try_set_color() {
      if (this.$current_component.palette) {
        if (!this.date.cell.id) {
          await this.get_object()
        }

        let color = this.$current_component.palette_color

        this.date.cell.color = color
      }
    },
  },

  watch: {
    date: {
      deep: true,

      async handler() {
        if (this.date.type == 'cell') {
          if (!this.date.cell.id) {
            await this.get_object()
          }

          if (!this.is_updating) {
            clearInterval(this.update_timer)
          }

          this.update_timer = setTimeout(async () => {
            await this.$http.post('cell', {
              'action': 'update',
              'view': this.$current_view,
              'team_id': this.$current_team_id,
              'app_id': this.$current_app_id,
              'element_type': 'cell',
              'element_id': this.date.cell.id,
              'profile_id': this.date.cell.profile,
              'presence': this.date.cell.presence,
              'absence': this.date.cell.absence,
              'color': this.date.cell.color,
            })
          }, 1000)
        }
      }
    },
  },
}

</script>


<style>

</style>


<style scoped>

.day-container {
  margin-left: 2px;
  margin-bottom: 2px;
  position: relative;
  z-index: 2;
}

.day-frame {
  max-width: 45px;
  min-width: 45px;
  max-height: 40px;
  min-height: 40px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 5px;
  border: 1px #212121 solid;
  overflow: hidden;
  cursor: pointer;
}

.day-frame:hover {
  filter: brightness(1.3);
}

.day-frame-default {
  background-color: #212121;
  color: white;
}

.day-frame-cv {
  background-color: yellow;
}

.day-name {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
}

.day-number {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
}

.day-has-content {
  background-color: #0078ad;
}

.day-step {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  font-weight: bold;
  width: 15px;
  height: 15px;
  border: 1px black solid;
  border-radius: 8px;
  position: absolute;
  pointer-events: none;
  z-index: 3;
}

.day-step-week {
  background-color: rgb(99, 203, 255);
  top: 26px;
  left: -1px;
}

.day-step-cv {
  background-color: yellow;
  top: 26px;
  left: 31px;

}

.cell-frame {
  min-width: 45px;
  max-width: 45px;
  min-height: 74px;
  max-height: 74px;
  margin-left: 2px;
  margin-bottom: 2px;
  overflow: hidden;
  position: relative;
  border: 1px #78909C solid;
  border-radius: 5px;
  z-index: 2;
}

.cell-presence {
  width: 45px;
  height: 28px;
  text-transform: uppercase;
  text-align: center;
  outline:  none;
  font-weight: bold;
  padding-right: 2px;
}

.cell-absence {
  width: 45px;
  height: 28px;
  text-transform: uppercase;
  text-align: center;
  outline:  none;
  font-weight: bold;
  padding-right: 2px;
}

.cell-short {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 45px;
  max-width: 45px;
  min-height: 17px;
  max-height: 17px;
  cursor: pointer;
  color: blue;
  font-weight: bold;
  white-space: nowrap;
  padding-right: 2px;
}

.cell-short:hover {
  filter: brightness(1.2);
}

.cell-short-has_content {
  background-color: #6bd1ff;
}

.cell-presence-week {
  border-bottom: 1px #B0BEC5 solid;
  background-color: #F3F3F3;
}

.cell-absence-week {
  border-top: 1px white solid;
  border-bottom: 1px #B0BEC5 solid;
  background-color: #E9E9E9;
}

.cell-short-week {
  border-top: 1px #ECEFF1 solid;
  background-color: #dcdcdc;
}

.cell-presence-sat {
  border-bottom: 1px #B0BEC5 solid;
  background-color: #CEDFEF;
}

.cell-absence-sat {
  border-top: 1px white solid;
  border-bottom: 1px #B0BEC5 solid;
  background-color: #B3D1EB;
}

.cell-short-sat {
  border-top: 1px #ECEFF1 solid;
  background-color: #a2bfd8;
}

.cell-presence-sun {
  border-bottom: 1px #B0BEC5 solid;
  background-color: #EFD9CE;
}

.cell-absence-sun {
  border-top: 1px white solid;
  border-bottom: 1px #B0BEC5 solid;
  background-color: #E2BDAB;
}

.cell-short-sun {
  border-top: 1px #ECEFF1 solid;
  background-color: #cea693;
}

.cell-presence-holi {
  border-bottom: 1px #B0BEC5 solid;
  background-color: #ebca8f;
}

.cell-absence-holi {
  border-top: 1px white solid;
  border-bottom: 1px #B0BEC5 solid;
  background-color: #edbd66;
}

.cell-short-holi {
  border-top: 1px #ECEFF1 solid;
  background-color: #edb44e;
}

.cell-has-call {
  position: relative;
  top: -84px;
  left: -10px;
  width: 20px;
  height: 20px;
  background-color: red;
  transform: rotate(45deg);
}

</style>
