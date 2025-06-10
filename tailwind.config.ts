import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.tsx',
    './src/**/*.mdx',
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Open Sans', 'sans-serif']
    },
  },
  plugins: [],
};

export default config;

