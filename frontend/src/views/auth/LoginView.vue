<template>
  <div v-if="!isLoggedIn" class="login-container">
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
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  <div v-if="isLoggedIn" class="login-container">
    <h2>Hey, {{ user.username }}</h2>
    <button @click="logout">Logout</button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['isLoggedIn', 'user'])
  },
  methods: {
    ...mapActions(useAuthStore, { authLogin: 'login', authLogout: 'logout' }),
    async login() {
      await this.authLogin(this.username, this.password)
            .then(() => {
              if (this.$router.currentRoute.value.query.redirect) {
                this.$router.push(this.$router.currentRoute.value.query.redirect)
              } else {
                this.$router.push('/')
              }
            })
            .catch(() => this.error = "Failed to login. Please check your credentials.")
    },
    logout() {
      this.authLogout()
    }
  },
}
</script>

<style>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
}

.error {
  color: red;
}
</style>
