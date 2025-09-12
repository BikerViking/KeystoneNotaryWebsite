import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { attachGlobalScrollTriggerRefresh, ensureGSAP } from './lib/gsap';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize GSAP globally and attach refresh listeners when in the browser
if (typeof window !== 'undefined') {
  ensureGSAP();
  attachGlobalScrollTriggerRefresh();
}
