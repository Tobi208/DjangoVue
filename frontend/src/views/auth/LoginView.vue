<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// router
const router = useRouter()
const route = useRoute()

// store for persistent data
const auth = useAuthStore()
const isLoggedIn = computed(() => auth.isLoggedIn)
const user = computed(() => auth.user)

// reactive input data
const username = ref('')
const password = ref('')
const error = ref(null)

// ui logic
// animate dot dot dot on login button while auth is loading
const loggingIn = ref(false)
const dotdotdot = ref('.')
const startDotAnimation = () => {
  let dotCount = 0
  dotdotdot.value = '.'
  const iId = setInterval(() => {
    dotCount = (dotCount % 5) + 1 
    dotdotdot.value = '.'.repeat(dotCount) 
  }, 100)

  return iId
}
let intervalId = null

// cleanup if page is left during animation
onUnmounted(() => {
  if (loggingIn.value) {
    clearInterval(intervalId)
  }
})

// authenticate through auth store
const login = async () => {
  intervalId = startDotAnimation()
  loggingIn.value = true
  try {
    await auth.login(username.value, password.value)
    username.value = ''
    password.value = ''
    error.value = ''
    router.push(route.query.redirect || '/')
  } catch (e) {
    error.value = "Failed to login. Please check your credentials."
  }
  loggingIn.value = false
  clearInterval(intervalId)
}

const logout = () => {
  auth.logout()
  username.value = ''
  password.value = ''
  error.value = ''
}
</script>

<template>
  <div v-if="!isLoggedIn" class="form-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username:</label>
        <input v-model="username" id="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required>
      </div>
      <button type="submit" :disabled="loggingIn">{{ loggingIn ? dotdotdot : 'Login' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  <div v-if="isLoggedIn" class="form-container">
    <h3>Hey, {{ user.username }}, you are already logged in</h3>
    <button @click="logout">Logout</button>
  </div>
</template>

<style lang="sass" scoped>
.form-container
  max-width: 400px

  .form-group
    margin-bottom: 20px
    width: 100%

    label
      display: block

    input
      width: 100%
  
  button
    width: 100%

.error
  color: red
</style>
