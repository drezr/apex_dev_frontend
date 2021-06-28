<template>

<v-dialog v-model="_open" :max-width="width">
  <v-card>
    <v-card-title
      :class="[
        title_bg_color ? title_bg_color : '',
        subtitle_text ? 'py-1' : '',
      ]"
      style="word-break: keep-all;"
    >
      <v-icon
        class="mr-3"
        :class="title_text_color ? title_text_color + '--text' : ''"
        v-if="title_icon"
      >
        {{ title_icon }}
      </v-icon>

      <span :class="title_text_color + '--text'">
        {{ title_text }}
      </span>

      <v-card-subtitle v-if="subtitle_text" class="pa-0" style="width: 100%;">
       {{ subtitle_text }}
      </v-card-subtitle>

      <div class="ml-3 move-button modal-move" v-if="move_window && breakpoint">
        <v-icon color="pink" class="modal-move">
          mdi-cursor-move
        </v-icon>
      </div>
    </v-card-title>

    <v-card-text>

      <slot></slot>
      
    </v-card-text>

    <v-card-actions v-if="!hide_action">
      <v-spacer></v-spacer>

      <v-btn
        :color="cancel_color ? cancel_color : 'white'"
        @click="$emit('cancel')"
        text
      >
        <v-icon
          v-if="cancel_icon"
          :class="[
            cancel_text ? 'mr-2' : '',
            cancel_text_color ? cancel_text_color + '--text' : 'black--text',
          ]"
        >
          {{ cancel_icon }}
        </v-icon>

        <span
          v-if="cancel_text"
          :class="[
            cancel_text_color ? cancel_text_color + '--text' : 'black--text',
          ]"
        >
          {{ cancel_text }}
        </span>
      </v-btn>

      <v-btn
        :color="confirm_color ? confirm_color : 'blue'"
        @click="$emit('confirm')"
      >
        <v-icon
          v-if="confirm_icon"
          :class="[
            confirm_text ? 'mr-2' : '',
            confirm_text_color ? confirm_text_color + '--text' : 'white--text',
          ]"
        >
          {{ confirm_icon }}
        </v-icon>

        <span
          v-if="confirm_text"
          :class="[
            confirm_text_color ? confirm_text_color + '--text' : 'white--text',
          ]"
        >
          {{ confirm_text }}
        </span>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>


<script>


export default {
  name: 'CustomDialog',

  components: {

  },

  props: {
    open: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    title_icon: {
      type: String,
      required: false,
    },
    title_text: {
      type: String,
      required: true,
    },
    title_text_color: {
      type: String,
      required: false,
    },
    title_bg_color: {
      type: String,
      required: false,
    },
    subtitle_text: {
      type: String,
      required: false,
    },
    cancel_icon: {
      type: String,
      required: false,
    },
    cancel_text: {
      type: String,
      required: false,
    },
    cancel_color: {
      type: String,
      required: false,
    },
    cancel_text_color: {
      type: String,
      required: false,
    },
    confirm_icon: {
      type: String,
      required: false,
    },
    confirm_text: {
      type: String,
      required: false,
    },
    confirm_color: {
      type: String,
      required: false,
    },
    confirm_text_color: {
      type: String,
      required: false,
    }, 
    hide_action: {
      type: Boolean,
      required: false,
    }, 
    move_window: {
      type: Boolean,
      required: false,
    },    
  },

  data() {
    return {

    }
  },

  created() {

  },

  computed: {
    _open: {
      get() {
        return this.open
      },

      set() {
        setTimeout(() => this.$emit('cancel'), 100)
      }
    },

    breakpoint() {
      return this.$vuetify.breakpoint.smAndUp
    },
  },

  methods: {

  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.move-button {
  position: absolute;
  right: 10px;
  cursor: move;
  border: 1px #E91E63 solid;
  border-radius: 3px;
  padding: 4px 20px;
}

</style>
