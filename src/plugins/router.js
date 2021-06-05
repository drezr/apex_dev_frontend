import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/apex/Login.vue'
import Home from '@/views/apex/Home.vue'
//import Hub from '@/views/apex/Hub.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        'app': 'apex',
        'view': 'home',
        'title': 'Apex',
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        'app': 'apex',
        'view': 'login',
        'title': 'Apex - Login',
      },
    },
  ]
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    document.title = to.meta.title
  })

  next()
})

export default router
