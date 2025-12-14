<template>
  <main class="center-box">
    <div class="signup-box">
      <form class="signup-form" @submit.prevent="addPost">

        <h3 style="text-align:center;">Add Post</h3>

        <div class="form-row">
          <label>Body</label>
          <input
            type="text"
            v-model="body"
            placeholder="body"
            required
          />
        </div>

        <button class="signup-button" type="submit">
          Add
        </button>

        <p v-if="error" style="color:red; margin-top:10px;">
          {{ error }}
        </p>

      </form>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      body: '',
      error: ''
    }
  },
  methods: {
    async addPost() {
      this.error = ''

      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push('/login')
        return
      }

      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          body: this.body
        })
      })

      const data = await res.json()

      if (!res.ok) {
        this.error = data.error || 'Failed to add post'
        return
      }

      this.$router.push('/')
    }
  }
}
</script>


