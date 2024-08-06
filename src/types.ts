import type { App } from 'vue';

export interface UserModule {
  onAppInit?: (app: App) => void;
}
