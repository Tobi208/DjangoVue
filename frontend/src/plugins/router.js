import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import PostsView from '../views/blog/PostsView.vue'

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

export function RouterPlugin(app) {

  // intercept all routes to check if they require authentication
  // redirect over login page if applicable
  const auth = useAuthStore()
  router.beforeEach((to) => {
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }
  })

  app.use(router)
}

export default router
