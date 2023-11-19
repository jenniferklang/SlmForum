import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';

const routes = [
  {
    path: '/',
    component: () => import('./pages/LoginRegisterPage.vue'),
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('./components/Text.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/user',
    component: () => import('./pages/UserSettings.vue'),
  },
  {
    path: '/policy',
    component: () => import('./pages/PrivacyPolicy.vue'),
  },
  {
    path: '/posttopic',
    component: () => import('./pages/PostTopic.vue'),
  },
  {
    path: '/about',
    component: () => import('./components/Text.vue'),
  },
  {
    path: '/forum',
    component: () => import('./pages/ForumPage.vue'),
    //meta: { requiresAuth: true },
  },
  {
    path: '/chat',
    component: () => import('./pages/Chat.vue'),
  },
  {
    path: '/posttopic',
    component: () => import('./pages/PostTopic.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const isTokenValid = await checkToken();
    console.log('isTokenValid: ', isTokenValid);
    if (isTokenValid) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});

async function checkToken() {
  const token = sessionStorage.getItem('jwt');

  if (!token) {
    return false;
  }

  try {
    const response = await axios.post('/api/auth/validate', { token });
    console.log('Validate JWT response: ', response.data);
    sessionStorage.setItem('user_id', response.data.userId);
    return response.data.valid;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export default router;