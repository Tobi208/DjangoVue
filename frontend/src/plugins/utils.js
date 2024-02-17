import { jwtDecode } from 'jwt-decode'

/**
 * Extract seconds until expiration usable by VueCookies
 * 
 * @param {string} token jwt token with expiration date 
 * @returns seconds until expiration as '{expiration}s'
 */
export const getExpiration = (token) => {
  const decodedToken = jwtDecode(token)
  const now = Math.floor(Date.now() / 1000)
  const exp = decodedToken.exp
  return `${exp - now}s`
}
