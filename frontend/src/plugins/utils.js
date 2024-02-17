import { jwtDecode } from 'jwt-decode'

export const getExpiration = (token) => {
  const decodedToken = jwtDecode(token)
  const now = Math.floor(Date.now() / 1000)
  const exp = decodedToken.exp
  return `${exp - now}s`
}
