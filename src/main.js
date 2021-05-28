import Vue from 'vue'
import App from '@/App.vue'
import router from '@/plugins/router.js'
import store from '@/plugins/store.js'
import vuetify from '@/plugins/vuetify'
import draggable from 'vuedraggable'

Vue.config.productionTip = false

Vue.component('draggable', draggable)

new Vue({
  router,
  store,
  vuetify,
  draggable,
  render: h => h(App)
}).$mount('#app')