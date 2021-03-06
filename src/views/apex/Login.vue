<template>

<div class="login-frame">
  <v-img :src="$tool.get_logo('apex_1000x1000')" class="logo" />

  <v-card class="login-card">
    <div v-if="mode == 'login'">
      <v-alert type="error" v-if="login_error">
        {{ lang.views.login.error_message[lg] }}
      </v-alert>

      <v-alert type="success" v-if="reset_success">
        {{ lang.views.login.success_message_reset[lg] }}
      </v-alert>


      <v-text-field
        outlined
        clearable
        autofocus
        :label="lang.generic.email[lg]"
        v-model="login_email"
        :rules="email_rules"
        tabindex="1"
      ></v-text-field>


      <v-text-field
        outlined
        clearable
        :label="lang.generic.password[lg]"
        type="password"
        v-model="password"
        :rules="password_rules"
        tabindex="2"
        ref="password"
      ></v-text-field>


      <v-btn
        block
        color="green"
        @click="login"
        :dark="can_login"
        :disabled="!can_login"
        ref="connection"
        tabindex="3"
      >
        <v-icon class="mr-3">mdi-exit-to-app</v-icon>
        {{ lang.generic.connection[lg] }}
      </v-btn>


      <div
        class="text-center mt-3 blue--text cursor-pointer hover-brightness"
        @click="switch_mode"
      >
        {{ lang.views.login.forgot_password[lg] }}
      </div>
    </div>




    <div v-if="mode == 'reset'">
      <Loader :size="50" :width="6" v-if="reset_loading" />

      <v-alert type="error" v-if="reset_error" class="mb-0">
        {{ lang.views.login.error_message_reset[lg] }}
      </v-alert>

      <div class="filler">
        <b>{{ lang.views.login.reset_password_title[lg] }}</b>
        <small class="grey--text">
          {{ lang.views.login.reset_password_subtitle[lg] }}
        </small>
      </div>


      <v-text-field
        outlined
        clearable
        autofocus
        :label="lang.generic.email[lg]"
        v-model="reset_email"
        :rules="email_rules"
        tabindex="1"
      ></v-text-field>


      <v-btn
        block
        color="blue"
        @click="reset"
        :dark="can_reset"
        :disabled="!can_reset"
        ref="reset"
        tabindex="2"
      >
        <v-icon class="mr-3">mdi-email</v-icon>
        {{ lang.generic.send[lg] }}
      </v-btn>


      <div
        class="text-center mt-3 blue--text cursor-pointer hover-brightness"
        @click="switch_mode"
        tabindex="3"
      >
        {{ lang.views.login.back_to_login[lg] }}
      </div>
    </div>
  </v-card>
</div>

</template>


<script>

export default {
  name: 'LoginView',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      mode: 'login',
      login_email: '',
      reset_email: '',
      password: '',
      login_error: false,
      reset_success: false,
      reset_error: false,
      reset_loading: false,

      email_rules: [
        value => !!value || this.lang.views.login.error_insert_email[this.lg],
        value => this.$tool.is_valid_email(value) || this.lang.views.login.error_format_email[this.lg],
      ],
      password_rules: [
        value => !!value || this.lang.views.login.error_insert_password[this.lg],
      ],
    }
  },

  async created() {
    if (this.$tool.get_cookie('token')) {
      this.$router.push({'path': '/'})
      return
    }

    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    document.cookie = `sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    document.cookie = `csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`


    this.handler = (e) => {
      if (e.keyCode == 13) {
        if (this.mode == 'login') {
          this.$refs.connection.$el.click()
        }

        else if (this.mode == 'reset') {
          this.$refs.reset.$el.click()
        }
      }
    }

    window.addEventListener('keyup', this.handler)    
  },

  beforeDestroy() {
    window.removeEventListener('keyup', this.handler)
  },

  computed: {
/*
For connection button disabling
*/
    can_login() {
      let is_email_empty = !this.login_email || this.login_email.length == 0
      let is_password_empty = !this.password || this.password.length == 0
      let is_email_not_valid = !this.$tool.is_valid_email(this.login_email)

      return !(is_email_empty || is_password_empty || is_email_not_valid)
    },

/*
For reset password button disabling
*/
    can_reset() {
      let is_email_empty = !this.reset_email || this.reset_email.length == 0
      let is_email_not_valid = !this.$tool.is_valid_email(this.reset_email)

      return !(is_email_empty || is_email_not_valid)
    },
  },

  methods: {
    switch_mode() {
      this.mode = {'login': 'reset', 'reset': 'login'}[this.mode]
    },

/*
- Set email input to lowercase.
- Get generated token from backend.
  - Get profile infos from backend.
  - Store the profile (vuex store)
  - Set cookies
  - Redirect to "Home" view
            - OR -
  - Display an error message.
*/
    async login() {
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      document.cookie = `username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      document.cookie = `sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      document.cookie = `csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`

      this.login_email = this.login_email.toLowerCase()
      this.login_email = this.login_email.replaceAll(/\s/g,'')

      let token = await this.$http.post(`api-token-auth`, {
        'username': this.login_email,
        'password': this.password,
      })

      if (token.token) {
        this.$http.header = {'Authorization': 'Token ' + token.token}

        let request = await this.$http.get('profile', {
          'username': this.login_email,
        })

        this.$store.commit('set_logged_profile', request.profile)

        document.cookie = `token=${token.token}; expires=Thu, 31 Dec 2023 12:00:00 UTC;`

        document.cookie = `username=${request.profile.username}; expires=Thu, 31 Dec 2023 12:00:00 UTC;`

        this.$router.push({'path': '/'})
      }

      else {
        this.login_error = true
      }
    },

    async reset() {
      this.reset_loading = true
      this.reset_success = false
      this.reset_error = false
      this.login_error = false
      
      this.reset_email = this.reset_email.toLowerCase()
      this.reset_email = this.reset_email.replaceAll(/\s/g,'')

      let request = await this.$http.post(`reset_password`, {
        'action': 'reset_password',
        'username': this.reset_email,
        'lang': this.lg,
      })

      if (request.result == 'success') {
        this.reset_success = true
        this.login_email = this.reset_email
        this.mode = 'login'

        setTimeout(() => {
          this.$refs.password.$el.getElementsByTagName('input')[0].focus()
        }, 100)
      }

      else if (request.result == 'error') {
        this.reset_error = true
      }

      this.reset_loading = false
    },
  },

  watch: {

  },
}

</script>


<style>

</style>


<style scoped>

.login-frame {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 100%;
  padding: 10px 10px;
}

.logo {
  max-width: 240px;
  max-height: 240px;
  margin-bottom: 20px;
}

.login-card {
  width: 100%;
  max-width: 360px;
  min-height: 280px;
  padding: 20px;
}

.filler {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 86px;
}

</style>
