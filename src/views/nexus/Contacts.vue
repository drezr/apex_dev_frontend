<template>

<div>
  <Loader :size="100" :width="10" :mt="200" v-if="loading" />

  <transition name="fade">
    <div v-if="!loading">
      <div class="d-flex flex-wrap justify-center mt-3">
        <NavigationBar style="max-width: 320px;" class="mb-3" />

        <div class="d-flex">
          <v-autocomplete
            v-model="picked_profile"
            :items="all_profiles"
            item-text="name"
            item-value="id"
            outlined
            chips
            small-chips
            hide-details
            deletable-chips
            :allow-overflow="false"
            :label="lang.views.nexus.add_new_contact[lg]"
            :no-data-text="profiles_loading ? lang.generic.loading[lg] + '...' : lang.generic.no_result[lg]"
            style="min-width: 260px; max-width: 260px;"
            class="add-profile-text-field mr-1 mb-3"
            @focus="get_profiles()"
          ></v-autocomplete>

          <CustomButton
            @click="add_contact"
            :loading="add_button_loading"
            :color="'green'"
            :icon="'mdi-account-plus'"
            :text_color="'white'"
            :tooltip="lang.generic.add[lg]"
            :disabled="!picked_profile"
            style="position: relative; top: 1px;"
          />
        </div>
      </div>

      <VueDraggable
        v-model="app.contacts"
        @change="update_position"
        :animation="100"
        easing="cubic-bezier(1, 0, 0, 1)"
        handle=".handle"
        class="d-flex flex-wrap justify-center mt-3"
      >
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
              <div class="flex-grow-1">
                <v-icon small>mdi-phone</v-icon>
                {{ contact.phone }}
              </div>

              <div
                class="contact-drag-button pink handle"
                :style="`cursor: ${grab_cursor};`"
                @mousedown="grab_cursor = 'grabbing'"
                @mouseup="grab_cursor = 'grab'"
                @mouseleave="grab_cursor = 'grab'"
              >
                <v-icon size="16" color="white">mdi-drag</v-icon>
              </div>
            </div>
          </div>
        </div>
      </VueDraggable>
    </div>
  </transition>
</div>

</template>


<script>

import NavigationBar from '@/components/NavigationBar.vue'
import DayCell from '@/views/watcher/components/DayCell.vue'

export default {
  name: 'Contacts',

  components: {
    NavigationBar,
    DayCell,
  },

  props: {
    
  },

  data() {
    return {
      loading: true,
      add_button_loading: false,
      app: Object(),
      grab_cursor: 'grab',
      all_profiles: Array(),
      picked_profile: Array(),
      profiles_loading: true,
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

    this.app.contacts.sort((a, b) => a.link.position - b.link.position)

    for (let contact of this.app.contacts) {
      contact.cell = {
        'presence': contact.presence,
        'absence': contact.absence,
        'color': null,
      }
    }

    this.loading = false
  },

  computed: {

  },

  methods: {
    update_position() {

    },

    set_disabled_profiles() {
      for (let profile of this.all_profiles) {
        if (this.app.contacts.map(p => p.id).includes(profile.id)) {
          profile.disabled = true
        }

        else {
          profile.disabled = false
        }
      }
    },

    async get_profiles() {
      if (this.profiles_loading) {
        let request = await this.$http.get('all_profiles')
        this.all_profiles = request['all_profiles']
        this.all_profiles.sort((a, b) => (a.name).localeCompare(b.name))

        this.set_disabled_profiles()
        this.profiles_loading = false
      }
    },

    add_contact() {
      this.add_button_loading = true

      setTimeout(() => {
        this.add_button_loading = false
        this.picked_profile = Array()
      }, 1000) 
    },
  },

  watch: {

  },
}

</script>


<style>

.add-profile-text-field .v-input__slot {
  min-height: 40px !important;
  max-height: 40px !important;
}

.add-profile-text-field .v-label {
  top: 10px !important;
}

.add-profile-text-field .v-label--active {
  top: 16px !important;
}

.add-profile-text-field .v-input__append-inner {
  margin-top: 9px !important;
}



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
  display: flex;
  font-size : 12px;
  border-radius: 5px;
  background-color: rgba(0, 100, 255, 0.05);
  color: rgba(50, 100, 200, 0.9);
  padding: 3px 6px;
  width: 198px;
}

.contact-drag-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19px;
  height: 19px;
  border-radius: 10px;
}

</style>
