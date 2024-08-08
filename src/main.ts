import type { UserModule } from './types';
import { createApp } from 'vue';

import '@unocss/reset/tailwind.css';
import './style/main.css';
import 'virtual:uno.css';

import App from './App.vue';

const app = createApp(App);

Object.values(import.meta.glob<{ default: UserModule }>('./modules/*.ts', { eager: true }))
  .forEach(({ default: i }) => i.onAppInit?.(app));

app.mount('#workbench');
