<template>
  <main class="feed">
    <div
      class="post"
      v-for="post in posts"
      :key="post.id"
      @click="goToPost(post.id)"
      style="cursor:pointer;"
    >
      <div class="post-header">
        <!-- placeholder profile image -->
        <img
          class="profile"
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="profile"
        />

        <span class="username">{{ post.user_email }}</span>
        <span class="date">{{ formatDate(post.created_at) }}</span>
      </div>

      <p class="post-text">
        {{ post.body }}
      </p>
    </div>

    <button class="signup-button" @click="$router.push('/add')">
      Add Post
    </button>

    <button @click="deleteAllPosts">
      Delete All Posts
    </button>
  </main>
</template>

<script>
export default {
  name: 'HomeView',

  data() {
    return {
      posts: []
    }
  },

  async mounted() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push('/login')
      return
    }

    try {
      const res = await fetch('http://localhost:3000/posts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Failed to load posts')

      this.posts = await res.json()
    } catch (err) {
      alert(err.message)
    }
  },

  methods: {
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString()
    },

    goToPost(id) {
      this.$router.push(`/post/${id}`)
    },

    async deleteAllPosts() {
      const token = localStorage.getItem('token')
      if (!token) return alert('Login required')

      try {
        const res = await fetch('http://localhost:3000/posts', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error('Delete failed')

        this.posts = []
      } catch (err) {
        alert('Delete failed: ' + err.message)
      }
    }
  }
}
</script>
