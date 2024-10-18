/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('daisyui'),

    require('tailwind-scrollbar'),
    require('@tailwindcss/line-clamp'),

  ],
};