import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve at root path during dev and typical hosting
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5175,
    strictPort: true
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          tiptap: [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-underline',
            '@tiptap/extension-text-align',
            '@tiptap/extension-link',
            '@tiptap/extension-text-style',
            '@tiptap/extension-color',
            '@tiptap/extension-bullet-list',
            '@tiptap/extension-ordered-list',
            '@tiptap/extension-list-item',
            '@tiptap/extension-blockquote',
            '@tiptap/extension-code-block'
          ],
          yjs: ['yjs', 'y-websocket', 'y-prosemirror']
        }
      }
    }
  }
})
