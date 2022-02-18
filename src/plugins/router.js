import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/apex/Login.vue'
import Home from '@/views/apex/Home.vue'
import MyApex from '@/views/apex/MyApex.vue'
import Team from '@/views/apex/Team.vue'
import Calendar from '@/views/watcher/Calendar.vue'
import CalendarPrintable from '@/views/watcher/CalendarPrintable.vue'
import Quota from '@/views/watcher/Quota.vue'
import Calls from '@/views/watcher/Calls.vue'
import Leaves from '@/views/watcher/Leaves.vue'
import Works from '@/views/radium/Works.vue'
import WorksPrintable from '@/views/radium/WorksPrintable.vue'
import Board from '@/views/planner/Board.vue'
import BoardPrintable from '@/views/planner/BoardPrintable.vue'
import Projects from '@/views/draft/Projects.vue'
import Project from '@/views/draft/Project.vue'
import ProjectPrintable from '@/views/draft/ProjectPrintable.vue'
import Contacts from '@/views/nexus/Contacts.vue'

import CalendarMobile from '@/views/mobile/CalendarMobile.vue'
import QuotaMobile from '@/views/mobile/QuotaMobile.vue'
import WorksMobile from '@/views/mobile/WorksMobile.vue'

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
      path: '/myapex',
      name: 'MyApex',
      component: MyApex,
      meta: {
        'app': 'apex',
        'view': 'myapex',
        'title': 'myapex',
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
    {
      path: '/team/:team_id/watcher/:app_id/calendarprintable/month/:month/year/:year',
      name: 'CalendarPrintable',
      component: CalendarPrintable,
      meta: {
        'app': 'watcher',
        'view': 'calendarprintable',
        'title': 'Watcher',
      },
    },
    {
      path: '/team/:team_id/watcher/:app_id/quota/profile/:profile_id/year/:year',
      name: 'Quota',
      component: Quota,
      meta: {
        'app': 'watcher',
        'view': 'quota',
        'title': 'Watcher',
      },
    },
    {
      path: '/team/:team_id/watcher/:app_id/calls/month/:month/year/:year',
      name: 'Calls',
      component: Calls,
      meta: {
        'app': 'watcher',
        'view': 'calls',
        'title': 'Watcher',
      },
    },
    {
      path: '/team/:team_id/watcher/:app_id/leaves/year/:year',
      name: 'Leaves',
      component: Leaves,
      meta: {
        'app': 'watcher',
        'view': 'leaves',
        'title': 'Watcher',
      },
    },
    {
      path: '/team/:team_id/radium/:app_id/works/month/:month/year/:year',
      name: 'Works',
      component: Works,
      meta: {
        'app': 'radium',
        'view': 'works',
        'title': 'Radium',
      },
    },
    {
      path: '/team/:team_id/radium/:app_id/worksprintable/month/:month/year/:year',
      name: 'WorksPrintable',
      component: WorksPrintable,
      meta: {
        'app': 'radium',
        'view': 'worksprintable',
        'title': 'Radium',
      },
    },
    {
      path: '/team/:team_id/planner/:app_id/board/month/:month/year/:year',
      name: 'Board',
      component: Board,
      meta: {
        'app': 'planner',
        'view': 'board',
        'title': 'Planner',
      },
    },
    {
      path: '/team/:team_id/planner/:app_id/boardprintable/month/:month/year/:year',
      name: 'BoardPrintable',
      component: BoardPrintable,
      meta: {
        'app': 'planner',
        'view': 'boardprintable',
        'title': 'Planner',
      },
    },
    {
      path: '/team/:team_id/draft/:app_id/projects',
      name: 'Projects',
      component: Projects,
      meta: {
        'app': 'draft',
        'view': 'projects',
        'title': 'Draft',
      },
    },
    {
      path: '/myapex/draft/:app_id/projects',
      name: 'MyApexProjects',
      component: Projects,
      meta: {
        'app': 'draft',
        'view': 'myapexprojects',
        'title': 'Draft',
      },
    },
    {
      path: '/team/:team_id/draft/:app_id/project/:project_id',
      name: 'Project',
      component: Project,
      meta: {
        'app': 'draft',
        'view': 'project',
        'title': 'Draft',
      },
    },
    {
      path: '/team/:team_id/draft/:app_id/projectprintable/:project_id',
      name: 'ProjectPrintable',
      component: ProjectPrintable,
      meta: {
        'app': 'draft',
        'view': 'projectprintable',
        'title': 'Draft',
      },
    },
    {
      path: '/myapex/draft/:app_id/project/:project_id',
      name: 'MyApexProject',
      component: Project,
      meta: {
        'app': 'draft',
        'view': 'myapexproject',
        'title': 'Draft',
      },
    },
    {
      path: '/myapex/nexus/:app_id/contacts/day/:day/month/:month/year/:year',
      name: 'Nexus',
      component: Contacts,
      meta: {
        'app': 'nexus',
        'view': 'myapexcontacts',
        'title': 'Nexus',
      },
    },
    {
      path: '/mobile',
      alias: '/mobile/calendar/day/:day/month/:month/year/:year',
      name: 'CalendarMobile',
      component: CalendarMobile,
      meta: {
        'app': 'mobile',
        'view': 'calendarmobile',
        'title': 'Apex Mobile',
      },
    },
    {
      path: '/mobile/quota/year/:year',
      name: 'QuotaMobile',
      component: QuotaMobile,
      meta: {
        'app': 'mobile',
        'view': 'quotamobile',
        'title': 'Apex Mobile',
      },
    },
    {
      path: '/mobile/works/month/:month/year/:year',
      name: 'WorksMobile',
      component: WorksMobile,
      meta: {
        'app': 'mobile',
        'view': 'worksmobile',
        'title': 'Apex Mobile',
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
