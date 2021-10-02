import Vue from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router.js'
import store from '@/plugins/store.js'
import vuetify from '@/plugins/vuetify'
import draggable from 'vuedraggable'

import Http from '@/modules/http.js'
import Tools from '@/modules/tools.js'

import Loader from '@/components/Loader.vue'
import CustomButton from '@/components/CustomButton.vue'
import CustomDialog from '@/components/CustomDialog.vue'

import Access from '@/mixins/Access.vue'
import Current from '@/mixins/Current.vue'
import Lang from '@/mixins/Lang.vue'
import Shared from '@/mixins/Shared.vue'
// import WebSocket from '@/mixins/WebSocket.vue' // makes v-autocomplete multiple to bug

Vue.config.productionTip = false

Vue.prototype.$http = Http
Vue.prototype.$tool = Tools

Vue.component('VueDraggable', draggable)
Vue.component('Loader', Loader)
Vue.component('CustomButton', CustomButton)
Vue.component('CustomDialog', CustomDialog)

Vue.mixin(Access)
Vue.mixin(Current)
Vue.mixin(Lang)
Vue.mixin(Shared)
// Vue.mixin(WebSocket) // makes v-autocomplete multiple to bug

new Vue({
  router,
  store,
  vuetify,
  draggable,
  render: h => h(App)
}).$mount('#app')