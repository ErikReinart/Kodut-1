<template>
  <header class="navbar">
    <div class="nav-left">
      <router-link to="/" id="home">Home</router-link>
      <span>|</span>
      <router-link to="/contact">Contacts</router-link>
    </div>

    <div class="nav-right" v-if="loggedIn">
      <img
        class="profile"
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        @click="show = !show"
      />

      <div class="dropdown" v-if="show">
        <p>{{ email }}</p>
        <p @click="logout" style="cursor:pointer;">Logout</p>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  computed: {
    loggedIn() {
      return !!localStorage.getItem('token')
    },
    email() {
      const token = localStorage.getItem('token')
      if (!token) return ''
      try {
        return JSON.parse(atob(token.split('.')[1])).email
      } catch {
        return ''
      }
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.show = false
      this.$router.push('/login')
    }
  }
}
</script>

