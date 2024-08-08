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
  shortcuts: {
    'box-center': 'flex justify-center items-center',
  },
  theme: {
    colors: {
      fgMain: 'var(--bi-fg-main)',
      bgMain: 'var(--bi-bg-main)',
      lineMain: 'var(--bi-line-main)',
      primary: 'var(--bi-primary)',
      primaryHover: 'var(--bi-primaryHover)',
      primaryActive: 'var(--bi-primaryActive)',
      default: 'var(--bi-default)',
      defaultHover: 'var(--bi-defaultHover)',
      defaultActive: 'var(--bi-defaultActive)',
    },
  },
});
