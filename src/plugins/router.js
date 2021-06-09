import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/apex/Login.vue'
import Home from '@/views/apex/Home.vue'
import Team from '@/views/apex/Team.vue'
import Calendar from '@/views/watcher/Calendar.vue'

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
        'title': 'Login',
      },
    },
    {
      path: '/team/:team_id',
      name: 'Team',
      component: Team,
      meta: {
        'app': 'apex',
        'view': 'team',
        'title': 'Apex',
      },
    },
    {
      path: '/team/:team_id/watcher/:app_id/calendar/month/:month/year/:year',
      name: 'Calendar',
      component: Calendar,
      meta: {
        'app': 'watcher',
        'view': 'calendar',
        'title': 'Watcher',
      },
    },
  ]
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    document.title = to.meta.title
    router.app.$tool.set_favicon(to.meta.app)
  })

  next()
})

export default router
