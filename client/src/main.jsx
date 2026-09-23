/*----- FILE: main.jsx | CONTENT: React entry point. Mounts the App component into the root HTML element and loads global CSS. -----*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/global.css";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
