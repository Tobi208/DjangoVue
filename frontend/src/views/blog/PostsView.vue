<template>
    <div>
        number of posts: {{ posts.length }}
    </div>
    <button @click="fetchData">Fetch</button>
</template>

<script>
export default {
  data() {
    return {
      posts: []
    }
  },
  methods: {
    async fetchData() {
      this.posts = await this.$api.get('/posts/')
    }
  }
}
</script>
