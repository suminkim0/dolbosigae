import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 기존 ReactDOM.render 제거
// ReactDOM.render(<App />, document.getElementById('root'));

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);