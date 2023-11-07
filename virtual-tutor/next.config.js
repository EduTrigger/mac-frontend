/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
    plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  }
};

console.log('Custom Next.js configuration loaded');
