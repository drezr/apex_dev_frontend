<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <v-dialog
        ref="dialog"
        v-model="date_dialog"
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="$tool.format_date(date)"
            :label="lang.views.nexus.select_date[lg]"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            hide-details
            class="my-6 mx-auto"
            style="width: 180px;"
          ></v-text-field>
        </template>

        <v-date-picker
          v-model="date"
          :first-day-of-week="1"
          :locale="`${lg}-${lg}`"
          scrollable
          no-title
          @input="go_to_date($event)"
          class="py-6"
        ></v-date-picker>
      </v-dialog>

      <div class="d-flex justify-center">
        <div
          v-for="(contact, i) in app.contacts"
          :key="i"
          class="contact-frame"
        >
          <div>
            <DayCell
              :type="'cell'"
              :date="contact"
              style="margin-top: 2px; margin-right: 2px;"
            />
          </div>
          
          <div>
            <div class="contact-name">
              {{ contact.name }}
            </div>

            <div class="contact-phone">
              <v-icon>mdi-phone</v-icon>
              {{ contact.phone }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>

</template>


<script>

import DayCell from '@/views/watcher/components/DayCell.vue'

export default {
  name: 'Contacts',

  components: {
    DayCell,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      date_dialog: false,
      date: null,
      app: Object(),
    }
  },

 async created() {
    this.request = await this.$http.get('contacts', {
      'app_id': this.$current_app_id,
      'day': this.$route.params.day,
      'month': this.$route.params.month,
      'year': this.$route.params.year,
    })

    this.app = this.request.app

    for (let contact of this.app.contacts) {
      contact.cell = {
        'presence': contact.presence,
        'absence': contact.absence,
        'color': null,
      }
    }

    this.date = `${this.$route.params.year}-${this.$route.params.month}-${this.$route.params.day}`


    this.loading = false
  },

  computed: {

  },

  methods: {
    go_to_date(event) {
      let [year, month, day] = event.split('-')

      this.$router.push(`/myapex/nexus/${this.$current_app_id}/contacts/day/${day}/month/${month}/year/${year}`)
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.contact-frame {
  display: flex;
  border: 1px rgba(50, 100, 200, 1) solid;
  border-radius: 5px;
  width: 250px;
  margin: 5px;
}

.contact-name {
  background-color: rgba(0, 100, 255, 0.1);
  color: rgba(50, 100, 200, 1);
  border-radius: 5px;
  margin: 2px 2px 2px 0;
  padding: 3px 8px;
  width: 198px;
  font-weight: bold;
}

.contact-phone {
  font-size : 13px;
  border-radius: 5px;
  background-color: rgba(0, 100, 255, 0.05);
  color: rgba(50, 100, 200, 0.9);
  padding: 2px 6px;
  width: 198px;
}

</style>
