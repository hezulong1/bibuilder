import { defineConfig, presetUno, presetIcons, presetWebFonts, transformerDirectives } from 'unocss';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

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
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        width: '14px',
        height: '14px',
      },
      collections: {
        'vscode': FileSystemIconLoader('./node_modules/@vscode/codicons/src/icons'),
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
      tooltip: 'var(--bi-tooltip)',
    },
  },
});
