<template>
    <div>
        <h2>Posts</h2>
        <div v-for="post in posts" :key="post.id">
          <div>{{ post.title }} by {{ post.author }}</div>
          <p>{{ post.content }}</p>
        </div>
    </div>
    <div>
        <h2>New Post</h2>
        <div>
          <input v-model="newPost.title" type="text">
          <input v-model="newPost.content" type="text">
          <button @click="savePost">Submit</button>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
      newPost: {}
    }
  },
  created() {
    this.posts = this.$api.get('/posts/')
  },
  methods: {
    async savePost() {
      if (this.newPost.title?.length > 0 && this.newPost.content?.length > 0)
      this.$api.post('/posts/', this.newPost)
        .then(() => this.newPost = {})
    }
  }
}
</script>
