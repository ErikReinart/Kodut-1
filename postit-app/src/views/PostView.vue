<template>
  <main class="center-box">
    <div class="form">
      <h2>Edit Post</h2>

      <textarea
          v-model="body"
          rows="5"
          placeholder="Edit post text"
          style="width: 100%;"
      ></textarea>

      <p class="date">
        Created at: {{ formatDate(created_at) }}
      </p>

      <button class="signup-button" @click="updatePost">
        Update
      </button>

      <button class="signup-button" @click="deletePost">
        Delete
      </button>
    </div>
  </main>
</template>

<script>
export default {
  name: 'PostView',

  data() {
    return {
      body: '',
      created_at: ''
    }
  },

  async mounted() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push('/login')
      return
    }

    try {
      const res = await fetch(
          `http://localhost:3000/posts/${this.$route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      )

      if (!res.ok) throw new Error('Failed to load post')

      const post = await res.json()
      this.body = post.body
      this.created_at = post.created_at
    } catch (err) {
      alert(err.message)
      this.$router.push('/')
    }
  },

  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString()
    },

    async updatePost() {
      const token = localStorage.getItem('token')

      try {
        const res = await fetch(
            `http://localhost:3000/posts/${this.$route.params.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ body: this.body })
            }
        )

        if (!res.ok) throw new Error('Update failed')

        this.$router.push('/')
      } catch (err) {
        alert(err.message)
      }
    },

    async deletePost() {
      const token = localStorage.getItem('token')

      if (!confirm('Delete this post?')) return

      try {
        const res = await fetch(
            `http://localhost:3000/posts/${this.$route.params.id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
        )

        if (!res.ok) throw new Error('Delete failed')

        this.$router.push('/')
      } catch (err) {
        alert(err.message)
      }
    }
  }
}
</script>