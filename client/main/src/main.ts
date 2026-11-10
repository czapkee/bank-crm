import './styles.css';

import { configureApi, useAuthStore } from '@org/api-client';
import { createPinia } from 'pinia';
import { createApp } from 'vue';


import App from './App.vue';
import router from './router';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

const auth = useAuthStore(pinia);

configureApi({
  getAccessToken: () => auth.accessToken,
  onUnauthorized: async () => {
    const refreshed = await auth.refresh();

    if (!refreshed) {
      await router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath },
      });
    }

    return refreshed;
  },
});

app.use(router);
app.mount('#root');
