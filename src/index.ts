import { App } from 'vue'
import ColorPicker from './color/Index.vue'
function install(Vue: App) {
    Vue.component(ColorPicker.name, ColorPicker)
}

export default { install }

// export { ColorPicker }
export { default as ColorPicker } from './color/Index.vue'
// module.exports.ColorPicker = ColorPicker
// module.exports.default = install
