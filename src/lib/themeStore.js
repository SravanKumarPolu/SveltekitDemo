import { writable } from 'svelte/store';

// Check if we're running in the browser (to avoid SSR issues)
const isBrowser = typeof window !== 'undefined';

// Initialize theme from localStorage if in the browser, otherwise default to 'default'
const initialTheme = isBrowser ? localStorage.getItem('theme') || 'default' : 'default';

// Create a writable store with the initial theme value
export const themeStore = writable(initialTheme);

// Subscribe to the store to update <html> data-theme and localStorage when theme changes
themeStore.subscribe((theme) => {
  if (isBrowser) {
    document.documentElement.setAttribute('data-theme', theme); // Apply theme
    localStorage.setItem('theme', theme); // Persist theme
  }
});
