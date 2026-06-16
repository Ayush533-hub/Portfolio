import { defineConfig } from 'vite';

export default defineConfig({
  // Configure relative paths so build assets load correctly on any hosting platform
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
