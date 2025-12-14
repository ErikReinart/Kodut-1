<template>
  <main class="center-box">
    <div class="signup-box">
      <form class="signup-form" @submit.prevent="login">
        <div class="form-row">
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>

        <div class="form-row">
          <label>Password</label>
          <input type="password" v-model="password" required />
        </div>

        <div style="display:flex; gap:10px; justify-content:center;">
          <button class="signup-button" type="submit">Login</button>
          <button class="signup-button" type="button" @click="$router.push('/signup')">
            Signup
          </button>
        </div>

        <p v-if="error" style="color:red; margin-top:10px;">{{ error }}</p>
      </form>
    </div>
  </main>
</template>

<script>
const API = 'http://localhost:3000'

export default {
  data() {
    return { email: '', password: '', error: '' }
  },
  methods: {
    async login() {
      this.error = ''
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password })
      })

      const data = await res.json()
      if (!res.ok) {
        this.error = data?.error || 'Login failed'
        return
      }

      localStorage.setItem('token', data.token)
      this.$router.push('/')
    }
  }
}
</script>

