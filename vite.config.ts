const path = require('path')
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: 'demo',
  alias: {
    '/@/': path.resolve(__dirname, 'src'),
  },
  plugins: [vue()],
  optimizeDeps: {},
})
