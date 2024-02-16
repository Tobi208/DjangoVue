import axios from 'axios'

function createAPIInstance() {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function APIPlugin(app, { authPlugin }) {
  const api = createAPIInstance()

  api.interceptors.request.use((config) => {
    const { token } = authPlugin.state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  app.config.globalProperties.$api = api
}
