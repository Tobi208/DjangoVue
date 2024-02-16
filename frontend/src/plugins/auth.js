import { reactive, readonly } from 'vue'

const state = reactive({
  user: null,
  token: null,
  refreshToken: null,
  isLoggedIn: false,
})

const methods = {
  setUser(user) {
    state.user = user
  },
  setToken(token) {
    state.token = token
  },
  setRefreshToken(refreshToken) {
    state.refreshToken = refreshToken
  },
  setIsLoggedIn(isLoggedIn) {
    state.isLoggedIn = isLoggedIn
  },
  async login(username, password) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    if (response.status !== 200) {
        methods.setToken(null)
        methods.setUser(null)
        methods.setIsLoggedIn(false)
        throw new Error('Login failed')
    } else {
        const r = await response.json()
        methods.setToken(r.access)
        methods.setRefreshToken(r.refreshToken)
        methods.setUser({ username })
        methods.setIsLoggedIn(true)
    }
  },
  async logout() {
    methods.setToken(null)
    methods.setUser(null)
    methods.setIsLoggedIn(false)
  }
};

// Plugin installation function
export function AuthPlugin(app) {
  app.config.globalProperties.$auth = readonly({ ...methods, state });
}
