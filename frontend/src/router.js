import { createWebHistory, createRouter } from 'vue-router';
import Home from './Home.vue';
import Room from './Room.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/room',
    name: 'Room',
    component: Room
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
