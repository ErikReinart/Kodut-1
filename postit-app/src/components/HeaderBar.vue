<template>
  <header class="navbar">
    <div class="nav-left">
      <router-link to="/" id="home">Home</router-link>
      <router-link to="/signup">Signup</router-link>
    </div>

    <div class="nav-right">
      <img
        class="profile"
        @click="show = !show"
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
      />

      <div class="dropdown" v-if="show">
        <p>John Doe</p>
        <p>john.doe@ut.ee</p>
        <p>logout</p>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return { show: false };
  }
};
</script>
