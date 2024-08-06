import type { UserModule } from './types';
import { createApp } from 'vue';

import '@unocss/reset/tailwind.css';
import './style.css';
import 'virtual:uno.css';

import App from './App.vue';

const app = createApp(App);

Object.values(import.meta.glob<UserModule>('./modules/*.ts', { eager: true }))
  .forEach(i => i.onAppInit?.(app));

app.mount('#app');
