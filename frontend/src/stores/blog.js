import { defineStore } from 'pinia'
import api from '@/plugins/api'

/**
 * Store to manage blog data.
 * Use API here instead of views but allow for error catching in the view
 */
export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: []
  }),
  actions: {
    async fetchPosts() {
      const response = await api.get('/posts/')
      this.posts = response.data
    },
    async addPost(newPost) {
      const response = await api.post('/posts/', newPost)
      // invalidate post data
      this.fetchPosts()
      return response.data 
    }
  }
})
