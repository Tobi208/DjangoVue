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
      if (response.status !== 200) {
        throw new Error('Unable to retrieve posts from server')
      }
      this.posts = await response.json()
    },
    async addPost(newPost) {
      const response = await api.post('/posts/', newPost)
      if (response.status !== 201) {
        throw new Error('Unable to create post on server')
      }
      // invalidate post data
      this.fetchPosts()
      return await response.json()
    },
    async deleteAllPosts() {
      const ids = this.posts.map(({ id }) => id)
      for (const id of ids) {
        const response = await api.delete(`/posts/${id}/`)
        if (!response.ok) {
          throw new Error('Unable to delete post on server')
        }
        this.posts = this.posts.filter((p) => p.id !== id)
      }
    },
    free() {
      this.posts = []
    }
  }
})
