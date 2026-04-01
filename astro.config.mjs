import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  integrations: [],
  output: 'static',
  adapter: vercel(),
  devToolbar: { enabled: false },
});
