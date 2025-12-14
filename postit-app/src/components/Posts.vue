<template>
  <main class="feed">
    <div
        class="post"
        v-for="post in posts"
        :key="post.timeCreated"
        @click="goToPost(post)"
        style="cursor:pointer;"
    >
      <div class="post-header">
        <img
            class="profile"
            :src="post.ownerProfilePicture"
            alt="profile"
        />

        <span class="username">{{ post.owner }}</span>
        <span class="date">{{ formatDate(post.timeCreated) }}</span>
      </div>

      <!-- Conditionals for post data -->
      <div class="post-image" v-if="post.image">
        <img :src="post.image" alt="post image" />
      </div>

      <p v-if="post.text" class="post-text">
        {{ post.text }}
      </p>


      <div class="like">
        <button @click="like(post)">{{ post.likeCount }} 👍</button>
      </div>
    </div>
    <button class="signup-button" @click="resetLikesFunc">Reset likes</button>
    <button @click="$router.push('/add')">Add Post</button>
    <button @click="deleteAllPosts">Delete All Posts</button>
  </main>
</template>

<script>
export default {
  computed: {
    posts() {
      return this.$store.state.posts;
    }
  },

  methods: {
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString();
    },

    like(post) {
      // TODO...
      post.likeCount++;
    },

    resetLikesFunc() {
      this.$store.dispatch('resetLikesAct');
    },

    goToPost(post) {
      //redirecting to /post/:id page
      this.$router.push({ path: `/post/${post.id}` });
    },

    async deleteAllPosts() {
      const token = localStorage.getItem('token');
      if (!token) return alert('Login required');
      try {
        const res = await fetch('http://localhost:3000/posts', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      if (!res.ok) throw new Error("Delete failed");
      await this.$store.dispatch('loadPosts');
      } catch(err) {
        alert("Delete failed: " + err.message);
      }
    }
  }
}
</script>
