<template>
  <div class="color-alpha" @mousedown.prevent.stop="selectAlpha">
    <canvas ref="canvasAlpha" />
    <div :style="slideAlphaStyle" class="slide" />
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
    rgba: {
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
  setup() {
    const { createAlphaSquare, createLinearGradient } = useUtils()
    return {
      createAlphaSquare,
      createLinearGradient,
    }
  },
  data() {
    return {
      slideAlphaStyle: {},
      alphaSize: 5,
    }
  },
  watch: {
    color() {
      this.renderColor()
    },
    'rgba.a'() {
      this.renderSlide()
    },
  },
  mounted() {
    this.renderColor()
    this.renderSlide()
  },
  methods: {
    renderColor() {
      const canvas: any = this.$refs.canvasAlpha
      const width = this.width
      const height = this.height
      const size = this.alphaSize
      const canvasSquare = this.createAlphaSquare(size)

      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height

      ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')
      ctx.fillRect(0, 0, width, height)

      this.createLinearGradient(
        'p',
        ctx,
        width,
        height,
        'rgba(255,255,255,0)',
        this.color
      )
    },
    renderSlide() {
      this.slideAlphaStyle = {
        top: this.rgba.a * this.height - 2 + 'px',
      }
    },
    selectAlpha(e: any) {
      const { top: hueTop } = this.$el.getBoundingClientRect()

      const mousemove = (e: any) => {
        let y = e.clientY - hueTop

        if (y < 0) {
          y = 0
        }
        if (y > this.height) {
          y = this.height
        }

        let a = parseFloat((y / this.height).toFixed(2))
        this.$emit('selectAlpha', a)
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
.color-alpha {
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
