import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const baseMap = {
    beta: '/beta',
    prod: '/prod',
  };

  return {
    base: baseMap[mode as keyof typeof baseMap] || '/beta',
    plugins: [react()],
  };
});
