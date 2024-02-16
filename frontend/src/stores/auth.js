import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const { cookies } = useCookies()
    return {
      user: cookies.get('user') || null,
      token: cookies.get('token') || null,
      refreshToken: cookies.get('refreshToken') || null,
      isLoggedIn: cookies.get('isLoggedIn') || false,
    }
  },
  actions: {
    setUser(user) {
      this.user = user
      const { cookies } = useCookies()
      if (user)
        cookies.set('user', user, import.meta.env.VITE_REFRESH_TOKEN_EXPIRATION)
      else
        cookies.remove('user')
    },
    setToken(token) {
      this.token = token
      const { cookies } = useCookies()
      if (token)
        cookies.set('token', token, `${import.meta.env.VITE_TOKEN_EXPIRATION}s`)
      else
        cookies.remove('token')
    },
    async getToken() {
      const { cookies } = useCookies()
      if (cookies.isKey('token')) {
        return this.token
      } else {
        await this.refresh()
        return this.token
      }
    },
    setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken
      const { cookies } = useCookies()
      if (refreshToken)
        cookies.set('refreshToken', refreshToken, `${import.meta.env.VITE_REFRESH_TOKEN_EXPIRATION}s`)
      else
        cookies.remove('refreshToken')
    },
    setIsLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn
      const { cookies } = useCookies()
      if (isLoggedIn)
        cookies.set('isLoggedIn', isLoggedIn, `${import.meta.env.VITE_REFRESH_TOKEN_EXPIRATION}s`)
      else
        cookies.remove('isLoggedIn')
    },
    async login(username, password) {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      })
      if (response.status !== 200) {
          this.logout()
          throw new Error('Login failed')
      } else {
          const r = await response.json()
          this.setToken(r.access)
          this.setRefreshToken(r.refresh)
          this.setUser({ username })
          this.setIsLoggedIn(true)
      }
    },
    async refresh() {
      console.log('refetching')
      const { cookies } = useCookies()
      if (cookies.isKey('refreshToken')) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: this.refreshToken })
        })
        if (response.status !== 200) {
          this.logout()
          throw new Error('Token refresh failed')
        } else {
          const r = await response.json()
          this.setToken(r.access)
          this.setRefreshToken(r.refresh)
        }
      } else {
        throw new Error('Refresh token expired')
      }
    },
    logout() {
      this.setToken(null)
      this.setRefreshToken(null)
      this.setUser(null)
      this.setIsLoggedIn(false)
    },
  },
})
