import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [],
  output: 'hybrid',
  adapter: vercel(),
  devToolbar: { enabled: false },
});
