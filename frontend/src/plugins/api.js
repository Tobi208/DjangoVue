import axios from 'axios'
import router from '@/plugins/router'
import { useAuthStore } from '@/stores/auth'

// api calls that always require authentication
// configured with the appropriate base url
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
})

export function APIPlugin(app) {
  const auth = useAuthStore()

  // intercept every request to attach a bearer token
  // if the access token is expired, it will be refreshed first in the auth store
  // if the refresh token is expired, interrupt the current request and login
  api.interceptors.request.use(async (config) => {
    try {
      const token = await auth.getToken()
      config.headers.Authorization = `Bearer ${token}`
      return config
    } catch (error) {
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
      return new Promise(() => {})
    }
  }, error => {
    return Promise.reject(error)
  })

  app.config.globalProperties.$api = api
}

export default api
