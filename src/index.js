import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import DesignTorontoPuzzle from './designs/DesignTorontoPuzzle';
import reportWebVitals from './reportWebVitals';

const q = new URLSearchParams(window.location.search);
const root = ReactDOM.createRoot(document.getElementById('root'));
function Preview() {
  const [n, setN] = React.useState(Number(q.get('n') || 735));
  window.bump = () => setN((v) => v + 1);
  return <div style={{ position: 'fixed', inset: 0 }}><DesignTorontoPuzzle followers={n} username="torontoshop" platform={q.get('p') || 'instagram'} /></div>;
}
root.render(
  q.get('preview') ? <Preview /> :
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
