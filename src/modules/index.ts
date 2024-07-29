import type { App } from 'vue';

export interface BiModule {
  onAppInit?: (app: App) => void;
}
