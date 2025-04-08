import { createApp } from 'vue';
import App from './App.vue';
import '../popup/styles.css'; // Reuse the same Tailwind styles
import { isDev } from '@/utils/reload';

// Create the Vue application
const app = createApp(App);

// Mount the application
app.mount('#app');

// Enable HMR for development
if (isDev() && import.meta.hot) {
  import.meta.hot.accept();
}
