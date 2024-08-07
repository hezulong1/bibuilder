import { defineConfig, presetUno, presetWebFonts, transformerDirectives } from 'unocss';

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
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: [
    ['box-center', 'flex justify-center items-center'],
    ['inline-box-center', 'inline-flex justify-center items-center'],
  ],
  theme: {
    colors: {
      accent: 'var(--accent-color)',
    },
  },
});
