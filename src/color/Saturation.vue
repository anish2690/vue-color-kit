<template>
  <div class="saturation" @mousedown.prevent.stop="selectSaturation">
    <canvas ref="canvasSaturation" />
    <div :style="slideSaturationStyle" class="slide" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUtils } from './composible'

export default defineComponent({
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    hsv: {
      type: Object,
      default: null,
    },
    size: {
      type: Number,
      default: 152,
    },
  },
  setup() {
    const { createLinearGradient } = useUtils()
    return { createLinearGradient }
  },
  data() {
    return {
      slideSaturationStyle: {},
    }
  },
  // Can’t monitor, otherwise the color will change when you change yourself
  // watch: {
  //     color() {
  //         this.renderColor()
  //     }
  // },
  mounted() {
    this.renderColor()
    this.renderSlide()
  },
  methods: {
    renderColor() {
      const canvas: any = this.$refs.canvasSaturation
      const size = this.size
      const ctx = canvas.getContext('2d')
      canvas.width = size
      canvas.height = size

      ctx.fillStyle = this.color
      ctx.fillRect(0, 0, size, size)

      this.createLinearGradient(
        'l',
        ctx,
        size,
        size,
        '#FFFFFF',
        'rgba(255,255,255,0)'
      )
      this.createLinearGradient(
        'p',
        ctx,
        size,
        size,
        'rgba(0,0,0,0)',
        '#000000'
      )
    },
    renderSlide() {
      this.slideSaturationStyle = {
        left: this.hsv.s * this.size - 5 + 'px',
        top: (1 - this.hsv.v) * this.size - 5 + 'px',
      }
    },
    selectSaturation(e: any) {
      const {
        top: saturationTop,
        left: saturationLeft,
      } = this.$el.getBoundingClientRect()
      const ctx = e.target.getContext('2d')

      const mousemove = (e: any) => {
        let x = e.clientX - saturationLeft
        let y = e.clientY - saturationTop

        if (x < 0) {
          x = 0
        }
        if (y < 0) {
          y = 0
        }
        if (x > this.size) {
          x = this.size
        }
        if (y > this.size) {
          y = this.size
        }

        // Do not modify the dom by monitoring data changes, otherwise when the color is #ffffff, the slide will go to the lower left corner
        this.slideSaturationStyle = {
          left: x - 5 + 'px',
          top: y - 5 + 'px',
        }
        // If you use the maximum value, the selected pixel will be empty, and the empty default is black
        const imgData = ctx.getImageData(
          Math.min(x, this.size - 1),
          Math.min(y, this.size - 1),
          1,
          1
        )
        const [r, g, b] = imgData.data
        this.$emit('selectSaturation', { r, g, b })
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

<style lang="scss">
.saturation {
  position: relative;
  cursor: pointer;
  .slide {
    position: absolute;
    left: 100px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }
}
</style>
