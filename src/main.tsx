import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initPostHog } from './lib/posthog';
import { initCrisp } from './lib/crisp';

// Initialize PostHog analytics & error tracking
initPostHog();

// Initialize Crisp chat widget
initCrisp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);