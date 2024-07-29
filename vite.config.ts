import path from 'node:path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import WebfontDownload from 'vite-plugin-webfont-dl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    VueJsx(),
    Unocss(),
    WebfontDownload(),
    AutoImport({
      dts: 'src/typings/auto-imports.d.ts',
      imports: [
        'vue',
        '@vueuse/core',
      ],
      vueTemplate: true,
    }),
  ],
  resolve: {
    alias: [
      { find: '@/', replacement: `${path.resolve('src')}/` },
    ],
  },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
