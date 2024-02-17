import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'
import { getExpiration } from '@/plugins/utils'

const { cookies } = useCookies()

/**
 * Store to handle all things regarding authentication.
 * Synchronizes access and refresh tokens and auth status with cookies.
 * Automatically refreshes token if possible.
 */
export const useAuthStore = defineStore('auth', {
  state: () => {
  // get state from cookies or default to empty state
  return {
      user: cookies.get('user') || null,
      token: cookies.get('token') || null,
      refreshToken: cookies.get('refreshToken') || null,
      isLoggedIn: cookies.get('isLoggedIn') || false,
    }
  },
  actions: {

    // used by setters to sync with cookies
    syncCookie(name, value, expiration) {
      if (value)
        cookies.set(name, value, expiration)
      else
        cookies.remove(name)
    },
  
    // setters that synchronize with cookies
    setUser(user, expiration) {
      this.user = user
      this.syncCookie('user', user, expiration)
    },
    setToken(token, expiration) {
      this.token = token
      this.syncCookie('token', token, expiration)
    },
    setRefreshToken(refreshToken, expiration) {
      this.refreshToken = refreshToken
      this.syncCookie('refreshToken', refreshToken, expiration)
    },
    setIsLoggedIn(isLoggedIn, expiration) {
      this.isLoggedIn = isLoggedIn
      this.syncCookie('isLoggedIn', isLoggedIn, expiration)
    },

    // getters that might trigger actions
    async getToken() {
      if (!cookies.isKey('token')) {
        await this.refresh()
      }
      return this.token
    },

    // actions
    /**
     * Acquire access and refresh token from backend
     * 
     * @param {string} username 
     * @param {string} password 
     */
    async login(username, password) {
      // attempt login
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      })
      // probably invalid credentials on failure
      if (response.status !== 200) {
          this.logout()
          throw new Error('Login failed')
      }
      // populate state on success
      const r = await response.json()
      const tokenExpiration = getExpiration(r.access)
      const refreshTokenExpiration = getExpiration(r.refresh)
      this.setToken(r.access, tokenExpiration)
      this.setRefreshToken(r.refresh, refreshTokenExpiration)
      this.setUser({ username }, refreshTokenExpiration)
      this.setIsLoggedIn(true, refreshTokenExpiration)
    },
    
    /**
     * Acquire a new access token through the refresh token
     */
    async refresh() {
      // check if a refresh token is present in the cookies
      // require a reset of the authentication
      // catching this error should redirect to the login page
      if (!cookies.isKey('refreshToken')) {
        this.logout()
        throw new Error('Refresh token expired')
      }
      // attempt refresh
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: this.refreshToken })
      })
      // probably internal server error on failure
      if (response.status !== 200) {
        this.logout()
        throw new Error('Token refresh failed')
      }
      // populate state on success
      const r = await response.json()
      const tokenExpiration = getExpiration(r.access)
      const refreshTokenExpiration = getExpiration(r.refresh)
      this.setToken(r.access, tokenExpiration)
      this.setRefreshToken(r.refresh, refreshTokenExpiration)
      this.setUser(this.user, refreshTokenExpiration)
      this.setIsLoggedIn(true, refreshTokenExpiration)
    },

    /**
     * Reset auth state to empty
     */
    logout() {
      this.setToken(null, null)
      this.setRefreshToken(null, null)
      this.setUser(null, null)
      this.setIsLoggedIn(false, null)
    },
  },
})
