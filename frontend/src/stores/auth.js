import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'
import jwtDecode from 'jwt-decode'

const getExpiration = (token) => {
  const decodedToken = jwtDecode(token)
  const now = Math.floor(Date.now() / 1000)
  const exp = decodedToken.exp
  return exp - now
}

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
    setUser(user, expiration) {
      this.user = user
      const { cookies } = useCookies()
      if (user)
        cookies.set('user', user, expiration)
      else
        cookies.remove('user')
    },
    setToken(token, expiration) {
      this.token = token
      const { cookies } = useCookies()
      if (token)
        cookies.set('token', token, expiration)
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
    setRefreshToken(refreshToken, expiration) {
      this.refreshToken = refreshToken
      const { cookies } = useCookies()
      if (refreshToken)
        cookies.set('refreshToken', refreshToken, expiration)
      else
        cookies.remove('refreshToken')
    },
    setIsLoggedIn(isLoggedIn, expiration) {
      this.isLoggedIn = isLoggedIn
      const { cookies } = useCookies()
      if (isLoggedIn)
        cookies.set('isLoggedIn', isLoggedIn, expiration)
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
          const tokenExpiration = `${getExpiration(r.access)}s`
          const refreshTokenExpiration = `${getExpiration(r.refresh)}s`
          this.setToken(r.access, tokenExpiration)
          this.setRefreshToken(r.refresh, refreshTokenExpiration)
          this.setUser({ username }, refreshTokenExpiration)
          this.setIsLoggedIn(true, refreshTokenExpiration)
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
          const tokenExpiration = `${getExpiration(r.access)}s`
          const refreshTokenExpiration = `${getExpiration(r.refresh)}s`
          this.setToken(r.access, tokenExpiration)
          this.setRefreshToken(r.refresh, refreshTokenExpiration)
          this.setUser(this.user, refreshTokenExpiration)
          this.setIsLoggedIn(true, refreshTokenExpiration)
        }
      } else {
        throw new Error('Refresh token expired')
      }
    },
    logout() {
      this.setToken(null, null)
      this.setRefreshToken(null, null)
      this.setUser(null, null)
      this.setIsLoggedIn(false, null)
    },
  },
})
