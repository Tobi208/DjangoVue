import router from '@/plugins/router'
import { useAuthStore } from '@/stores/auth'

/**
 * Custom API interface that works on a base URL and intercepts requests
 * to refresh the token if necessary and add authorization to headers.
 */
const api = {
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // request interceptor
  async request(method, url, data = null, headers = {}) {
    try {
      // get token, possibly have to refresh
      const auth = useAuthStore()
      const token = await auth.getToken()
      headers['Authorization'] = `Bearer ${token}`
    } catch (error) {
      // cannot retrieve token and cannot refresh it
      // redirect to login page and invalidate request
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
      return new Promise(() => {})
    }
    // inject headers and body
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      }
    }
    if (!['get', 'delete'].includes(method.toLowerCase())) {
      options.body = data ? JSON.stringify(data) : null
    }
    // return prepare request
    return fetch(`${this.baseURL}${url}`, options)
  },

  // methods
  get(url, headers = {}) {
    return this.request('GET', url, null, headers)
  },
  post(url, data, headers = {}) {
    return this.request('POST', url, data, headers)
  },
  put(url, data, headers = {}) {
    return this.request('PUT', url, data, headers);
  },
  patch(url, data, headers = {}) {
    return this.request('PATCH', url, data, headers);
  },
  delete(url, headers = {}) {
    return this.request('DELETE', url, null, headers);
  },
}

export function APIPlugin(app) {
  app.config.globalProperties.$api = api
}

export default api
