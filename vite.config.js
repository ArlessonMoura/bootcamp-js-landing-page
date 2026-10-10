import { defineConfig } from 'vite';

// base relativo: funciona em GitHub Pages, Netlify, Vercel ou qualquer pasta
export default defineConfig({
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        // o Bootstrap 5.3 ainda usa @import; silencia só os avisos de depreciação do Sass
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        quietDeps: true,
        api: 'modern',
      },
    },
  },
});
