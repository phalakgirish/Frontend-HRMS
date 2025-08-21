import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

// Ignore ResizeObserver loop errors in Chrome console
const resizeObserverErr = /ResizeObserver loop completed/;

const origError = console.error;
console.error = (...args) => {
  if (args.length === 1 && resizeObserverErr.test(args[0])) {
    return; // suppress warning
  }
  origError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
