import { CardPage } from '@org/card-page';
import { UserPage } from '@org/user-page';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'UserPage',
      component: UserPage,
    },
    {
      path: '/card',
      name: 'CardPage',
      component: CardPage,
    },
  ],
});

export default router;
