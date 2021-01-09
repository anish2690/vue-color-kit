import { App } from 'vue'
import ColorPicker from './color'
function install(Vue: App) {
  Vue.component(ColorPicker.name, ColorPicker)
}

export default { install }

export { default as ColorPicker } from './color'
