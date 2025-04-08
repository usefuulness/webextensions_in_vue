/**
 * This utility helps manage extension reloading during development.
 * It watches for changes in the main extension files and reloads
 * the extension when needed.
 */

// Time to wait before triggering a reload
const RELOAD_DELAY = 500;
let lastReloadTime = Date.now();

// Create a debounced reload function
const debounceReload = (): void => {
  const currentTime = Date.now();
  if (currentTime - lastReloadTime > RELOAD_DELAY) {
    lastReloadTime = currentTime;
    console.log('🔄 Extension reloading...');
    
    // In Chrome, we can use the runtime reload method
    if (chrome.runtime.reload) {
      chrome.runtime.reload();
      return;
    }
    
    // For other browsers, try refreshing the extension pages
    if (typeof browser !== 'undefined' && browser?.runtime?.reload) {
      browser.runtime.reload();
      return;
    }
    
    // Fallback - attempt to reload the current window/tab
    window.location.reload();
  }
};

// Set up HMR listeners for Vite if available
if (import.meta.hot) {
  // Accept itself
  import.meta.hot.accept();
  
  // Listen for changes that should trigger a full extension reload
  import.meta.hot.on('vite:beforeFullReload', () => {
    debounceReload();
  });
}

// Export a function that can be called to force a reload
export const reloadExtension = debounceReload;

// Export a function to check if we're in development mode
export const isDev = (): boolean => import.meta.env.MODE === 'development';
