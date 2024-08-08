import path from 'node:path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import WebfontDownload from 'vite-plugin-webfont-dl';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const dev = command === 'serve';

  return {
    plugins: [
      Vue(),
      VueJsx(),
      Unocss(__dirname),
      WebfontDownload(),
      AutoImport({
        dts: 'typings/auto-imports.d.ts',
        imports: [
          'vue',
          '@vueuse/core',
          {
            '@unhead/vue': ['useHead'],
          },
          {
            '@hoppscotch/vue-toasted': ['useToasted'],
          },
        ],
        vueTemplate: true,
      }),
    ],
    define: {
      __DEV__: JSON.stringify(dev),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@editor': path.resolve(__dirname, 'src/editor'),
      },
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
  };
});
