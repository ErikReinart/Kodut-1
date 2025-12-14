import { createRouter, createWebHistory } from 'vue-router';

// Imports page
import LoginView from './views/LoginView.vue'
import SignupView from './views/SignupView.vue'
import HomeView from './views/HomeView.vue'
import AddPostView from './views/AddPostView.vue'
import PostView from './views/PostView.vue'
import ContactView from './views/ContactView.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/contact', component: ContactView },

  { path: '/', component: HomeView, meta: { requiresAuth: true } },
  { path: '/add', component: AddPostView, meta: { requiresAuth: true } },
  { path: '/post/:id', component: PostView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})

export default router
