import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Automatically register and activate PWA service worker
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('SIWES App update available');
  },
  onOfflineReady() {
    console.log('SIWES App is ready to work offline');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
