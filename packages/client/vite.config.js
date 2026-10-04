import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const DEFAULT_APP_TITLE = 'TaskFlow - Todo App'

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, 'VITE_')
  const appTitle = env.VITE_APP_TITLE || DEFAULT_APP_TITLE

  return {
    plugins: [
      react(),
      {
        // Fills %APP_TITLE% in index.html, falling back to the default title
        name: 'html-app-title',
        transformIndexHtml: (html) => html.replaceAll('%APP_TITLE%', escapeHtml(appTitle)),
      },
    ],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})
