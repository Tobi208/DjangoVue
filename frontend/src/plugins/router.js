import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import PostsView from '../views/blog/PostsView.vue'

export function RouterPlugin(app, { authPlugin }) {

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: false }
      },
      {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { requiresAuth: false }
      },
      {
        path: '/posts',
        name: 'posts',
        component: PostsView,
        meta: { requiresAuth: true }
      }
    ]
  })
  
  router.beforeEach((to) => {
    const { isLoggedIn } = authPlugin.state
    console.log(`logged in: ${isLoggedIn}`)
    if (to.meta.requiresAuth && !isLoggedIn) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }
  })

  app.use(router)
}
