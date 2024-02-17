<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav id="top-nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/posts">Posts</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style lang="sass">
*
  box-sizing: border-box

#top-nav
  padding: 20px
  display: flex
  gap: 20px
</style>
