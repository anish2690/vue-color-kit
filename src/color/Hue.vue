<template>
  <div class="hue" @mousedown.prevent.stop="selectHue">
    <canvas ref="canvasHue" />
    <div :style="slideHueStyle" class="slide" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    hsv: {
      type: Object,
      default: null,
    },
    width: {
      type: Number,
      default: 15,
    },
    height: {
      type: Number,
      default: 152,
    },
  },
  emits: ['selectHue'],
  data() {
    return {
      slideHueStyle: {},
    }
  },
  mounted() {
    this.renderColor()
    this.renderSlide()
  },
  methods: {
    renderColor() {
      const canvas: any = this.$refs.canvasHue
      const width = this.width
      const height = this.height
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#FF0000') // red
      gradient.addColorStop(0.17 * 1, '#FF00FF') // purple
      gradient.addColorStop(0.17 * 2, '#0000FF') // blue
      gradient.addColorStop(0.17 * 3, '#00FFFF') // green
      gradient.addColorStop(0.17 * 4, '#00FF00') // green
      gradient.addColorStop(0.17 * 5, '#FFFF00') // yellow
      gradient.addColorStop(1, '#FF0000') // red
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    },
    renderSlide() {
      this.slideHueStyle = {
        top: (1 - this.hsv.h / 360) * this.height - 2 + 'px',
      }
    },
    selectHue(e: any) {
      const { top: hueTop } = this.$el.getBoundingClientRect()
      const ctx = e.target.getContext('2d')

      const mousemove = (e: any) => {
        let y = e.clientY - hueTop

        if (y < 0) {
          y = 0
        }
        if (y > this.height) {
          y = this.height
        }

        this.slideHueStyle = {
          top: y - 2 + 'px',
        }
        // If you use the maximum value, the selected pixel will be empty, and the empty default is black
        const imgData = ctx.getImageData(0, Math.min(y, this.height - 1), 1, 1)
        const [r, g, b] = imgData.data
        this.$emit('selectHue', { r, g, b })
      }

      mousemove(e)

      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseup)
      }

      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', mouseup)
    },
  },
})
</script>

<style lang="scss" scoped>
.hue {
  position: relative;
  margin-left: 8px;
  cursor: pointer;
  .slide {
    position: absolute;
    left: 0;
    top: 100px;
    width: 100%;
    height: 4px;
    background: #fff;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }
}
</style>
