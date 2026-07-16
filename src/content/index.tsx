import { createRoot } from 'react-dom/client'
import App from '../app/App'
import '../styles/globals.css'

declare global {
  interface Window {
    __arcBmLoaded?: boolean
  }
}

;(() => {
  if (window.__arcBmLoaded) return
  window.__arcBmLoaded = true

  const container = document.createElement('div')
  container.id = 'arc-bm-sidebar'
  document.body.appendChild(container)

  chrome.storage.local.get('theme').then((result) => {
    const theme = (result.theme as string) || 'system'
    applyTheme(container, theme)
  })

  createRoot(container).render(<App />)
})()

export function applyTheme(el: HTMLElement, theme: string) {
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    el.setAttribute('data-theme', isDark ? 'dark' : 'light')
  } else {
    el.setAttribute('data-theme', theme)
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const el = document.getElementById('arc-bm-sidebar')
  if (el) {
    chrome.storage.local.get('theme').then((result) => {
      const theme = (result.theme as string) || 'system'
      if (theme === 'system') applyTheme(el, 'system')
    })
  }
})
