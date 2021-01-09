import { App } from 'vue'
import VueColorKit from './index.vue'

VueColorKit.install = (Vue: App) => {
  Vue.component(VueColorKit.name, VueColorKit)
}

export default VueColorKit
