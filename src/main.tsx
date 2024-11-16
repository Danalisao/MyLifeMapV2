import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker
registerSW({
  onNeedRefresh() {
    if (confirm('Une nouvelle version est disponible. Mettre à jour ?')) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log('Application prête pour une utilisation hors ligne');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);