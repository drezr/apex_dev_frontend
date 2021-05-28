import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: ['/home'],
      name: 'Home',
      // component: Home,
      meta: {
        'app': 'apex',
        'view': 'home',
        'title': 'Apex',
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
