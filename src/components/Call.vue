<template>
 
<div>
  <input type="file"
    class="d-none"
    ref="file-input"
    v-on:change="add_file($event)"
  />

  <v-card class="frame call-class">
    <input
      class="input input-name field blue lighten-4"
      placeholder="Nature du dérangement"
      v-model="self.name"
      ref="name"
      :disabled="disabled"
    />

    <input
      class="input input-type field blue lighten-5"
      placeholder="Type d'intervention"
      v-model="self.value"
      :disabled="disabled"
    />

    <div class="field-row mt-1">
      <div class="d-flex align-center mx-5">De</div>

      <input
        class="input field field-value"
        placeholder="Début de l'intervention"
        v-model="self.start"
        :disabled="disabled"
      />

      <div class="d-flex align-center mx-5">à</div>

      <input
        class="input field field-value"
        placeholder="Fin de l'intervention"
        v-model="self.end"
        :disabled="disabled"
      />

      <div class="hour-calculation mx-1">
        {{ hour_calc_default }}
      </div>

      <div class="hour-calculation mr-3">
        {{ hour_calc_decimal }}
      </div>
    </div>

    <div class="field-row">
    </div>

    <v-textarea
      class="px-0 mx-3 mt-1"
      placeholder="Déscription de l'intervention"
      v-model="self.description"
      :disabled="disabled"
      rows="1"
      auto-grow
      outlined
      color="orange"
    >
      
    </v-textarea>

    <div class="field-row field pa-2 grey lighten-5">
      <v-progress-circular
        v-if="loading"
        :size="20"
        class="ma-2"
        color="blue"
        indeterminate
      ></v-progress-circular>

      <div v-if="!loading">
        <v-btn
          v-if="disabled && file"
          @click="get_file"
          class="grey darken-4 white--text mr-3"
        >
          <v-icon class="mr-3">mdi-file-pdf</v-icon>
          <span>D27</span>
        </v-btn>

        <v-btn
          v-if="!disabled && !file"
          @click="$refs['file-input'].click()"
          color="blue"
          class="white--text"
        >
          <v-icon class="mr-3">mdi-upload</v-icon>
          <span>Envoyer un D27</span>
        </v-btn>

        <v-btn
          v-if="!disabled && file"
          @click="$refs['file-input'].click()"
          color="teal"
          class="white--text"
        >
          <v-icon class="mr-3">mdi-upload-outline</v-icon>
          <span>Remplacer le D27</span>
        </v-btn>

        <v-btn
          v-if="!disabled && file"
          class="ml-3 red white--text"
          @click="delete_file"
          elevation="3"
          icon
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <v-btn
        v-if="disabled && _link"
        @click="get_link"
        class="grey darken-4 white--text mr-3"
      >
        <v-icon class="mr-3">{{ link_icon }}</v-icon>
        <span>D27</span>
      </v-btn>

      <v-btn
        v-if="!disabled && !_link"
        color="blue"
        class="white--text ml-3"
        @click="add_link_dialog = true"
      >
        <v-icon class="mr-3">mdi-open-in-new</v-icon>
        <span>URL vers D27</span>
      </v-btn>

      <v-btn
        v-if="!disabled && _link"
        color="teal"
        class="white--text ml-3"
        @click="add_link_dialog = true"
      >
        <v-icon class="mr-3">mdi-open-in-new</v-icon>
        <span>URL vers D27</span>
      </v-btn>

      <v-btn
        v-if="!disabled && _link"
        class="ml-3 red white--text"
        @click="delete_link"
        elevation="3"
        icon
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <div v-if="access.can_edit_unit || $is_staff">
        <EditDropdown
          v-if="disabled"
          :menus="edit_dropdown_menus"
          v-on:dropdown_action="dropdown_action"
          :color="'blue'"
          :icon="'mdi-cog'"
          :tooltip="'Options d\'édition'"
        />

        <v-btn
          v-if="!disabled"
          @click="update"
          class="d-block"
          color="teal lighten-1"
          elevation="1"
          fab
          x-small
          raised
        >
          <v-icon color="white">mdi-content-save</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>

  <v-dialog v-model="delete_dialog" max-width="550">
    <v-card>
      <v-card-title class="mb-4" style="word-break: keep-all;">
        Êtes-vous sûr de vouloir supprimer cette intevention ?
      </v-card-title>

      <v-card-text
        v-if="self.children && self.children.length == 0"
        class="my-6"
      ></v-card-text>

      <v-card-text>
        <div
          class="d-flex orange--text mb-4"
          v-if="self.children && self.children.length > 0 &&
                self.link && self.link.is_original"
        >
          <v-icon large class="orange--text mr-5">mdi-information</v-icon>
          <div class="d-flex align-center">
            Un D27 est associé à cette intervention.
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="grey darken-3" text @click="delete_dialog = false">
          Annuler
        </v-btn>

        <v-btn color="red darken-1 white--text" @click="remove">
          <v-icon class="mr-2">mdi-delete</v-icon>
          Supprimer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="add_link_dialog" max-width="400">
    <v-card>
      <v-card-title class="mb-4" style="word-break: keep-all;">
        Introduire l'URL vers le D27
      </v-card-title>

      <v-card-text>
        <v-text-field
          label="URL"
          outlined
          v-model="link_input"
          ref="link-input"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="grey darken-3" text @click="add_link_dialog = false">
          Annuler
        </v-btn>

        <v-btn
          class="darken-1 white--text"
          :class="[_link ? 'teal' : 'blue']"
          @click="add_link"
        >
          <v-icon class="mr-2">mdi-content-save</v-icon>
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>

</template>


<script>

import EditDropdown from '@/views/apex/components/EditDropdown.vue'

export default {
  name: 'Call',

  components: {
    EditDropdown,
  },

  props: {
    source: Object,
    parent: Object,
    self: Object,
    offline: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      disabled: true,
      loading: false,
      delete_dialog: false,
      add_link_dialog: false,
      link_input: '',
    }
  },

  created() {

  },

  mounted() {
    
  },

  beforeDestroy() {

  },

  computed: {
    edit_dropdown_menus() {
      return [
        {
          'icon': 'mdi-content-copy',
          'name': 'Copier',
          'color': 'indigo',
          'action': 'copy',
        },
        {
          'icon': 'mdi-flip-to-front',
          'name': 'Déplacer',
          'color': 'light-blue',
          'action': 'move',
        },
        {
          'icon': 'mdi-delete',
          'name': 'Supprimer',
          'color': 'red',
          'action': 'delete',
        },
      ]
    },

    file() {
      for (let child of this.self.children) {
        if (child.type == 'file') {
          return child
        }
      }

      return null
    },

    _link() {
      for (let child of this.self.children) {
        if (child.type == 'link') {
          return child
        }
      }

      return null
    },

    link_icon() {
      if (this._link) {
        if (this._link.value.includes('drive.google')) {
          return 'mdi-google-drive'
        }

        else if (this._link.value.includes('docs.google')) {
          return 'mdi-google-drive'
        }
      }

      return 'mdi-file-pdf'
    },

    hour_calc_decimal() {
      let [start_hour, start_minute] = this.get_splitted_hour(this.self.start)
      let [end_hour, end_minute] = this.get_splitted_hour(this.self.end)

      if (start_hour != null && start_minute != null && end_hour != null && end_minute != null) {
        let start_date = new Date()
        start_date.setHours(start_hour, start_minute, 0, 0)

        let end_date = new Date()
        end_date.setHours(end_hour, end_minute, 0, 0)

        let result = (end_date - start_date) / 1000 / 60 / 60

        if (result < 0) result = 24 + result

        result = Math.round(result * 100) / 100

        if (isNaN(result)) return '?'

        return '+' + result
      }

      return '?'
    },

    hour_calc_default() {
      let decimal = parseFloat(this.hour_calc_decimal.substring(1))

      if (isNaN(decimal)) return '?'

      let hour = Math.floor(decimal)
      let minute = Math.round(((decimal - hour) * 100) / 100 * 60)

      if (minute == 0) minute = ''

      return hour + 'h' + minute
    },
  },

  methods: {
    get_splitted_hour(time) {
      if (time) {
        let hour, minute

        if (time.includes(':')) {
          [hour, minute] = time.split(':')
        }

        else if (time.toLowerCase().includes('h')) {
          [hour, minute] = time.toLowerCase().split('h')
        }

        return [parseInt(hour), parseInt(minute)]
      }

      return [null, null]
    },

    get_file() {
      let media = this.$http.media
      let dir = this.file.value
      let name = this.file.name
      let ext = this.file.extension

      let path = `${media}${dir}/${name}.${ext}`
      if (ext == '') path = `${media}${dir}/${name}`

      window.open(path)
    },

    get_link() {
      let url = this._link.value

      if (url) {
        url = url.match(/^http[s]?:\/\//) ? url : 'http://' + url

        window.open(url)
      }
    },

    async add_file(e) {

    },

    async add_link() {

    },

    delete_link() {

    },

    remove() {

    },

    update() {

    },
  },

  watch: {

  },
}

</script>

<style>

.call-class .v-text-field__details {
  display: none !important;
}

.call-class .v-input__slot {
  margin-bottom: 0px;
}

.call-class textarea {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  color: black !important;
}

</style>


<style scoped>

.frame {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px rgba(0, 0, 0, 0.2) solid;
}

.input {
  outline-color: orange;
  padding-left: 10px;
  padding-right: 10px;
}

.input:not(:disabled) {
  background-color: white !important;
  box-shadow: inset 0 0 0 1px grey;
}

.input:disabled {
  color: black;
}

.input-name {
  width: 100%;
  height: 40px;
  font-weight: bold;
  font-size: 15px !important;
}

.input-type {
  width: 100%;
  font-weight: bold;
  max-height: 30px;
  text-align: center;
}

.field {
  display: flex;
  align-items: center;
  font-size: 14px;
  min-height: 40px;
}

.field-row {
  display: flex;
}

.field-value {
  width: 50%;
  text-align: center;
  font-weight: bold;
}

.text-decoration-none {
  text-decoration: none;
}

.hour-calculation {
  border: 1px rgb(200, 200, 200) solid;
  border-radius: 5px;
  width: 120px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  color: rgb(70, 70, 70);
}

</style>
