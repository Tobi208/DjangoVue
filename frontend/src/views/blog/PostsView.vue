<script setup>
import { ref, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()
const newPost = ref({ title: '', content: '' })

onMounted(async () => {
  await blogStore.fetchPosts()
})

const savePost = async () => {
  if (newPost.value.title?.length > 0 && newPost.value.content?.length > 0) {
    await blogStore.addPost(newPost.value)
    newPost.value = { title: '', content: '' }
  }
}
</script>

<template>
    <div>
        <h2>Posts</h2>
        <div v-for="post in blogStore.posts" :key="post.id">
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
