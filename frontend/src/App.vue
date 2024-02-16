<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="doer">You did it!</div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/posts">Posts</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style lang="sass" scoped>
.doer
  background-color: grey
</style>
