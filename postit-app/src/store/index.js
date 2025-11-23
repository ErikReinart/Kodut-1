import { createApp } from 'vue'
import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            posts: []
        }
    },
    mutations: {
        setPosts(state, posts) {
            state.posts = posts;
        },
        
        resetLikes(state) {
            state.posts.forEach(post => {
                post.likeCount = 0;
            });
        }

    },
    actions: {
        async loadPosts({ commit }) {
            try {
                const response = await fetch('/posts.json')  // file in public/posts.json
                const data = await response.json()
                commit('setPosts', data)
            } catch (err) {
                console.error('Failed to load posts:', err)
            }
        },
        resetLikesAct({ commit }) {
            setTimeout(() => {
                commit("resetLikes");
            }, 0)
        }
    }
}
)

export default store