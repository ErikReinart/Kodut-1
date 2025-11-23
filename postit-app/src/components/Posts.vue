<template>
  <main class="feed">
    <div
        class="post"
        v-for="post in posts"
        :key="post.timeCreated"
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

      <div class="post-image">
        <img :src="post.image" alt="post image" />
      </div>

      <div class="like">
        <button @click="like(post)">{{ post.likeCount }} 👍</button>
      </div>
    </div>
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
    }
  }
};
</script>
