<script setup>
import { ref, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'

// store for persistent data
const blog = useBlogStore()

// reactive input data
const newPost = ref({ title: '', content: '' })

// async fetch data
onMounted(async () => {
  await blog.fetchPosts()
})

// make api call through store
const savePost = async () => {
  await blog.addPost(newPost.value)
  newPost.value = { title: '', content: '' }
}
</script>

<template>
  <h3>This is the posts page. It requires authentication.</h3>
  <div class="new-post-container">
    <h2>New Post</h2>
    <form @submit.prevent="savePost">
      <div class="form-group">
        <label for="title">Title:</label>
        <input v-model="newPost.title" id="title" required>
      </div>
      <div class="form-group">
        <label for="content">Content:</label>
        <input v-model="newPost.content" id="content" required>
      </div>
      <button type="submit">Create</button>
    </form>
  </div>
  <div>
    <h2>Posts</h2>
    <div v-for="post in blog.posts" :key="post.id">
      <div>{{ post.title }} by <b>{{ post.author }}</b></div>
      <p><i>{{ post.content }}</i></p>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.new-post-container
  max-width: 400px
  margin: auto
  padding: 20px

  .form-group
    margin-bottom: 20px

    label
      display: block
</style>
