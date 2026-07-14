import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register background service worker for automated 24-hour cache cleanup
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((registration) => {
        console.log("SmartSearch Service Worker registered successfully with scope: ", registration.scope);
      })
      .catch((error) => {
        console.warn("SmartSearch Service Worker registration failed: ", error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
