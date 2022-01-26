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
      `border-color: ${hex_colors[date.cell.color]}; border-width: 1px;
       box-shadow: 0 0 0 1px ${hex_colors[date.cell.color]};` : '' +
       $current_view != 'myapexcontacts' ? '' : 'max-height: 56px !important; min-height: 56px !important; pointer-events: none;'
      "
      :class="[
        $current_component.palette && $current_component.palette_mode != 'profile' ? 'cursor-fill' : '',
      ]"
      @click="try_set_color('border')"
    >
      <input
        type="text"
        v-model="date.cell.presence"
        :class="[
          select_text_color(date.cell.presence),
          select_text_size(date.cell.presence),
          date.cell.presence_color,
          date.cell.presence_color ? 'cell-text-stroke' : '',
          'cell-presence-' + cell_backgroud,
        ]"
        class="lighten-3 cell-presence"
        @focus="get_object($event)"
        :disabled="!$is_editor"
        :id="`${x}_${(y * 2)}`"
        @click="try_set_color('presence'); set_current_position(0);"
        autocomplete="off"
        style="border-bottom: 1px #B0BEC5 solid !important;"
      />

      <input
        type="text"
        v-model="date.cell.absence"
        :class="[
          select_text_color(date.cell.absence),
          select_text_size(date.cell.absence),
          date.cell.absence_color,
          date.cell.absence_color ? 'cell-text-stroke' : '',
          'cell-absence-' + cell_backgroud,
        ]"
        class="cell-absence lighten-3"
        @focus="get_object($event)"
        :disabled="!$is_editor"
        :id="`${x}_${(y * 2) + 1}`"
        @click="try_set_color('absence'); set_current_position(1);"
        autocomplete="off"
        style="border-top: 1px white solid !important; border-bottom: 1px #B0BEC5 solid !important;"
      />
      
      <div
        v-if="$current_view != 'myapexcontacts'"
        class="cell-short"
        :class="[
          date.cell.has_content ? 'cell-short-has_content' : 'cell-short-' + cell_backgroud,
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
      hex_colors: {
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
      return this.$refs.frame.getBoundingClientRect().x + document.getElementById('main-frame').scrollLeft
    },

    offset_y() {
      return this.$refs.frame.getBoundingClientRect().y + document.getElementById('main-frame').scrollTop
    },
  },

  methods: {
    select_text_color(value) {
      let color = 'red--text text--accent-4'

      if (value) {
        if (this.parent_cpnt && this.parent_cpnt.leave_config) {
          let config = this.parent_cpnt.leave_config

          let ignore_types = config.leave_types.filter(
            l => l.kind == 'ignore')

          let presence_types = config.leave_types.filter(
            l => l.kind == 'presence')

          let ignore_type_match = ignore_types.find(t => value.toUpperCase().includes(t.code.toUpperCase()))

          let presence_type_match = presence_types.find(t => value.toUpperCase().includes(t.code.toUpperCase()))

          if (presence_type_match && !ignore_type_match) {
            color = `${presence_type_match.color}--text text--darken-2`
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
      if (!this.parent_cpnt.palette && this.date.cell.id) {
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
              if (!this.date.cell[key]) {
                this.date.cell[key] = request.cell[key]
              }
            }

            this.is_requesting = false
          }
        }
      }
    },

    set_current_position(increment) {
      this.parent_cpnt.current_position = [this.x, (this.y * 2) + increment]
    },

    async try_set_color(target) {
      if (this.$current_component.palette && this.$current_component.palette_mode != 'profile') {
        if (!this.date.cell.id) {
          await this.get_object()
        }

        setTimeout(() => {
          let color = this.$current_component.palette_color

          if (this.$current_component.palette_mode == 'border') {
            this.date.cell.color = color
          }

          if (this.$current_component.palette_mode == 'cell') {
            if (target == 'presence') {
              this.date.cell.presence_color = color
            }

            else if (target == 'absence') {
              this.date.cell.absence_color = color
            }
          }
        }, 100)
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
              'presence_color': this.date.cell.presence_color,
              'absence_color': this.date.cell.absence_color,
              'short': this.date.cell.short,
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
  color: white;
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
  border-top: 1px #ECEFF1 solid;
}

.cell-short:hover {
  filter: brightness(1.2);
}

.cell-short-has_content {
  background-color: #6bd1ff;
}

.cell-presence-week {
  background-color: #F3F3F3;
}

.cell-absence-week {
  background-color: #E9E9E9;
}

.cell-short-week {
  background-color: #dcdcdc;
}

.cell-presence-sat {
  background-color: #CEDFEF;
}

.cell-absence-sat {
  background-color: #B3D1EB;
}

.cell-short-sat {
  background-color: #a2bfd8;
}

.cell-presence-sun {
  background-color: #EFD9CE;
}

.cell-absence-sun {
  background-color: #E2BDAB;
}

.cell-short-sun {
  background-color: #cea693;
}

.cell-presence-holi {
  background-color: #ebca8f;
}

.cell-absence-holi {
  background-color: #edbd66;
}

.cell-short-holi {
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

.cell-text-stroke {
  text-shadow: 0px 0px 3px white;
}

</style>
