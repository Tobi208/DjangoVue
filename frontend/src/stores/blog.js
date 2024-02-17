import { defineStore } from 'pinia'
import api from '@/plugins/api'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: []
  }),
  actions: {
    async fetchPosts() {
      try {
        const response = await api.get('/posts/')
        this.posts = response.data
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    },
    async addPost(newPost) {
      try {
        const response = await api.post('/posts/', newPost)
        this.fetchPosts()
        return response.data 
      } catch (error) {
        console.error('Error adding new post:', error)
      }
    }
  }
})
