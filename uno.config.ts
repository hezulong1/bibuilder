import { defineConfig, presetUno, presetWebFonts } from 'unocss';

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|tsx)/],
    },
  },
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: 'Inter',
        mono: 'IBM Plex Mono',
      },
    }),
  ],
});
