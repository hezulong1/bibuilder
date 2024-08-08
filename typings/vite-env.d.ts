/// <reference types="vite/client" />

export {};

declare global {
  const __DEV__: boolean;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    __DEV__: boolean;
  }
}
