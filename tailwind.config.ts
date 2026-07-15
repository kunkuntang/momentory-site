import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/admin/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/admin/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e2e8f0',
          ink: '#1e293b',
          muted: '#64748b',
          accent: '#6f8462',
          'accent-dark': '#40563b',
          danger: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};

export default config;
