import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style.css'
import { initMouseLogger } from './utils/e2j'

// Initialize mouse logger for Cypress tests
initMouseLogger();

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
