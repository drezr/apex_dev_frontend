import Vue from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router.js'
import store from '@/plugins/store.js'
import vuetify from '@/plugins/vuetify'
import draggable from 'vuedraggable'

import Http from '@/modules/http.js'
import Requests from '@/modules/requests.js'

Vue.config.productionTip = false

Vue.prototype.$http = Http
Vue.prototype.$req = Requests
Vue.prototype.$req.http = Vue.prototype.$http

Vue.component('draggable', draggable)

new Vue({
  router,
  store,
  vuetify,
  draggable,
  render: h => h(App)
}).$mount('#app')