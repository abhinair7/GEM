import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [],
  output: 'hybrid',
  adapter: vercel({ maxDuration: 60 }),
  devToolbar: { enabled: false },
});
