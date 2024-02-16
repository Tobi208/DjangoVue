import axios from 'axios'
import router from '@/plugins/router'
import { useAuthStore } from '@/stores/auth'

function createAPIInstance() {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function APIPlugin(app) {
  const api = createAPIInstance()
  const auth = useAuthStore()

  api.interceptors.request.use(async (config) => {
    try {
      const token = await auth.getToken()
      config.headers.Authorization = `Bearer ${token}`
      return config
    } catch (error) {
      auth.logout()
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
      return new Promise(() => {})
    }
  }, error => {
    return Promise.reject(error);
  })

  app.config.globalProperties.$api = api
}
