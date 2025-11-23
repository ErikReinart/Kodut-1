import { createRouter, createWebHistory } from 'vue-router';

// Imports page
import SignupView from './views/SignupView.vue';

const routes = [
  { path: '/signup', component: SignupView }
];

export default createRouter({
  history: createWebHistory(),
  routes});
