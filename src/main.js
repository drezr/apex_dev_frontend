import Vue from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router.js'
import store from '@/plugins/store.js'
import vuetify from '@/plugins/vuetify'
import draggable from 'vuedraggable'

import Http from '@/modules/http.js'

import CustomButton from '@/components/CustomButton.vue'

import Access from '@/mixins/Access.vue'
import Current from '@/mixins/Current.vue'
import Socket from '@/mixins/Socket.vue'

Vue.config.productionTip = false

Vue.prototype.$http = Http

Vue.component('VueDraggable', draggable)
Vue.component('CustomButton', CustomButton)

Vue.mixin(Access)
Vue.mixin(Current)
Vue.mixin(Socket)

new Vue({
  router,
  store,
  vuetify,
  draggable,
  render: h => h(App)
}).$mount('#app')