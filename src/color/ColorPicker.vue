<template>
  <div
    class="hu-color-picker"
    :class="{ light: isLightTheme }"
    :style="{ width: totalWidth + 'px' }"
  >
    <div class="color-set">
      <Saturation
        ref="saturation"
        :color="rgbString"
        :hsv="hsv"
        :size="hueHeight"
        @selectSaturation="selectSaturation"
      />
      <Hue
        ref="hue"
        :hsv="hsv"
        :width="hueWidth"
        :height="hueHeight"
        @selectHue="selectHue"
      />
      <Alpha
        ref="alpha"
        :color="rgbString"
        :rgba="rgba"
        :width="hueWidth"
        :height="hueHeight"
        @selectAlpha="selectAlpha"
      />
    </div>
    <div :style="{ height: previewHeight + 'px' }" class="color-show">
      <Preview
        :color="rgbaString"
        :width="previewWidth"
        :height="previewHeight"
      />
      <Sucker
        v-if="!suckerHide"
        :sucker-canvas="suckerCanvas"
        :sucker-area="suckerArea"
        @openSucker="openSucker"
        @selectSucker="selectSucker"
      />
    </div>
    <Box name="HEX" :color="modelHex" @inputColor="inputHex" />
    <Box name="RGBA" :color="modelRgba" @inputColor="inputRgba" />
    <Colors
      :color="rgbaString"
      :colors-default="colorsDefault"
      :colors-history-key="colorsHistoryKey"
      @selectColor="selectColor"
    />
    <!-- custom options -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setColorValue, rgb2hex } from './composible'

import Saturation from './Saturation.vue'
import Hue from './Hue.vue'
import Alpha from './Alpha.vue'
import Preview from './Preview.vue'
import Sucker from './Sucker.vue'
import Box from './Box.vue'
import Colors from './Colors.vue'

export default defineComponent({
  components: {
    Saturation,
    Hue,
    Alpha,
    Preview,
    Sucker,
    Box,
    Colors,
  },
  emits: ['changeColor', 'openSucker'],
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    theme: {
      type: String,
      default: 'dark',
    },
    suckerHide: {
      type: Boolean,
      default: true,
    },
    suckerCanvas: {
      type: null, // HTMLCanvasElement
      default: null,
    },
    suckerArea: {
      type: Array,
      default: () => [],
    },
    colorsDefault: {
      type: Array,
      default: () => [
        '#000000',
        '#FFFFFF',
        '#FF1900',
        '#F47365',
        '#FFB243',
        '#FFE623',
        '#6EFF2A',
        '#1BC7B1',
        '#00BEFF',
        '#2E81FF',
        '#5D61FF',
        '#FF89CF',
        '#FC3CAD',
        '#BF3DCE',
        '#8E00A7',
        'rgba(0,0,0,0)',
      ],
    },
    colorsHistoryKey: {
      type: String,
      default: 'vue-colorpicker-history',
    },
    width: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      hueWidth: 15,
      previewHeight: 30,
      modelRgba: '',
      modelHex: '',
      r: 0,
      g: 0,
      b: 0,
      a: 1,
      h: 0,
      s: 0,
      v: 0,
    }
  },
  computed: {
    isLightTheme(): boolean {
      return this.theme === 'light'
    },
    hueHeight(): number {
      return this.width * 0.8
    },
    totalWidth(): number {
      return this.hueHeight + (this.hueWidth + 8) * 2
    },
    previewWidth(): number {
      return this.totalWidth - (this.suckerHide ? 0 : this.previewHeight)
    },
    rgba(): object {
      return {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a,
      }
    },
    hsv(): object {
      return {
        h: this.h,
        s: this.s,
        v: this.v,
      }
    },
    rgbString(): string {
      return `rgb(${this.r}, ${this.g}, ${this.b})`
    },
    rgbaStringShort(): string {
      return `${this.r}, ${this.g}, ${this.b}, ${this.a}`
    },
    rgbaString(): string {
      return `rgba(${this.rgbaStringShort})`
    },
    hexString(): string {
      return rgb2hex(this.rgba, true)
    },
  },
  created() {
    Object.assign(this, setColorValue(this.color))
    this.setText()

    this.$watch('rgba', () => {
      this.$emit('changeColor', {
        rgba: this.rgba,
        hsv: this.hsv,
        hex: this.modelHex,
      })
    })
  },
  methods: {
    selectSaturation(color: any) {
      const { r, g, b, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, h, s, v })
      this.setText()
    },
    selectHue(color: any) {
      const { r, g, b, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, h, s, v })
      this.setText()
      this.$nextTick(() => {
        // @ts-ignore

        this.$refs.saturation.renderColor()
        // @ts-ignore

        this.$refs.saturation.renderSlide()
      })
    },
    selectAlpha(a: any) {
      this.a = a
      this.setText()
    },
    inputHex(color: string) {
      const { r, g, b, a, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, a, h, s, v })
      this.modelHex = color
      this.modelRgba = this.rgbaStringShort
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.saturation.renderColor()
        // @ts-ignore
        this.$refs.saturation.renderSlide()
        // @ts-ignore
        this.$refs.hue.renderSlide()
      })
    },
    inputRgba(color: string) {
      const { r, g, b, a, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, a, h, s, v })
      this.modelHex = this.hexString
      this.modelRgba = color
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.saturation.renderColor()
        // @ts-ignore

        this.$refs.saturation.renderSlide()
        // @ts-ignore

        this.$refs.hue.renderSlide()
      })
    },
    setText() {
      this.modelHex = this.hexString
      this.modelRgba = this.rgbaStringShort
    },
    openSucker(isOpen: boolean) {
      this.$emit('openSucker', isOpen)
    },
    selectSucker(color: string) {
      const { r, g, b, a, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, a, h, s, v })
      this.setText()
      this.$nextTick(() => {
        // @ts-ignore

        this.$refs.saturation.renderColor()
        // @ts-ignore

        this.$refs.saturation.renderSlide()

        // @ts-ignore
        this.$refs.hue.renderSlide()
      })
    },
    selectColor(color: string) {
      const { r, g, b, a, h, s, v } = setColorValue(color)
      Object.assign(this, { r, g, b, a, h, s, v })
      this.setText()
      this.$nextTick(() => {
        // @ts-ignore

        this.$refs.saturation.renderColor()
        // @ts-ignore

        this.$refs.saturation.renderSlide()

        // @ts-ignore
        this.$refs.hue.renderSlide()
      })
    },
  },
})
</script>

<style lang="scss">
.hu-color-picker {
  padding: 10px;
  background: #1d2024;
  border-radius: 4px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
  z-index: 1;
  &.light {
    background: #f7f8f9;
    .color-show {
      .sucker {
        background: #eceef0;
      }
    }
    .color-type {
      .name {
        background: #e7e8e9;
      }
      .value {
        color: #666;
        background: #eceef0;
      }
    }
    .colors.history {
      border-top: 1px solid #eee;
    }
  }
  canvas {
    vertical-align: top;
  }
  .color-set {
    display: flex;
  }
  .color-show {
    margin-top: 8px;
    display: flex;
  }
}
</style>
