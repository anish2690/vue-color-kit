const path = require('path')
import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
 const config:UserConfig = {
  root: 'demo',
  alias: {
    '/@/': path.resolve(__dirname, 'src'),
  },
  plugins:[vue()]
}
export default config