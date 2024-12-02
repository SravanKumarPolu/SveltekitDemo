/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('daisyui'),

    require('tailwind-scrollbar'),



  ],
  daisyui: {
    themes: [
      'default', 'emerald', 'retro', 'cyberpunk', 'valentine', 'aqua', 'dark', // Existing themes
      'luxury', 'dracula', 'coffee', 'autumn', 'emerald', 'business', 'forest', // New themes
      'night', 'halloween', 'pastel', 'fantasy', 'synthwave',
      'winter', 'lofi',
    ],
  },

};