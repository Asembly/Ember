import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { applyTheme } from './config/themes'
import { useThemeStore } from './stores/themeStore'
import './index.css'

// Apply the persisted theme (colors + design tokens) before the first render.
applyTheme(useThemeStore.getState().currentThemeId)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>,
)
