<template>
  <div>
    <svg
      v-if="!isSucking"
      :class="{ active: isOpenSucker }"
      class="sucker"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-12 -12 48 48"
      @click="openSucker"
    >
      <path
        d="M13.1,8.2l5.6,5.6c0.4,0.4,0.5,1.1,0.1,1.5s-1.1,0.5-1.5,0.1c0,0-0.1,0-0.1-0.1l-1.4-1.4l-7.7,7.7C7.9,21.9,7.6,22,7.3,22H3.1C2.5,22,2,21.5,2,20.9l0,0v-4.2c0-0.3,0.1-0.6,0.3-0.8l5.8-5.8C8.5,9.7,9.2,9.6,9.7,10s0.5,1.1,0.1,1.5c0,0,0,0.1-0.1,0.1l-5.5,5.5v2.7h2.7l7.4-7.4L8.7,6.8c-0.5-0.4-0.5-1-0.1-1.5s1.1-0.5,1.5-0.1c0,0,0.1,0,0.1,0.1l1.4,1.4l3.5-3.5c1.6-1.6,4.1-1.6,5.8-0.1c1.6,1.6,1.6,4.1,0.1,5.8L20.9,9l-3.6,3.6c-0.4,0.4-1.1,0.5-1.5,0.1"
      />
    </svg>
    <svg
      v-if="isSucking"
      class="sucker"
      viewBox="-16 -16 68 68"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#9099a4"
    >
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="4">
          <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import imgSucker from '../img/sucker.png'
export default defineComponent({
  props: {
    suckerCanvas: {
      type: Object, // HTMLCanvasElement
      default: null,
    },
    suckerArea: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isOpenSucker: false, // Whether it is in the straw state
      suckerPreview: null, // Preview color dom next to the straw
      isSucking: false, // Is it in a straw waiting state
    }
  },
  watch: {
    suckerCanvas(newVal) {
      this.isSucking = false
      this.suckColor(newVal)
      // newVal.style.cursor = `url('../img/sucker.png') 0 32, default`
      //TODO
    },
  },
  methods: {
    openSucker() {
      if (!this.isOpenSucker) {
        this.isOpenSucker = true
        this.isSucking = true
        this.$emit('openSucker', true)
        document.addEventListener('keydown', this.keydownHandler)
      } else {
        // The processing logic is the same as pressing the esc key
        this.keydownHandler({ keyCode: 27 })
      }
    },
    keydownHandler(e: any) {
      // esc
      if (e.keyCode === 27) {
        this.isOpenSucker = false
        this.isSucking = false
        this.$emit('openSucker', false)
        document.removeEventListener('keydown', this.keydownHandler)
        document.removeEventListener('mousemove', this.mousemoveHandler)
        document.removeEventListener('mouseup', this.mousemoveHandler)
        if (this.suckerPreview) {
          // @ts-ignore
          document.body.removeChild(this.suckerPreview)
          this.suckerPreview = null
        }
      }
    },
    mousemoveHandler(e: any) {
      const { clientX, clientY } = e
      const {
        top: domTop,
        left: domLeft,
        width,
        height,
      } = this.suckerCanvas.getBoundingClientRect()
      const x = clientX - domLeft
      const y = clientY - domTop
      const ctx = this.suckerCanvas.getContext('2d')
      const imgData = ctx.getImageData(
        Math.min(x, width - 1),
        Math.min(y, height - 1),
        1,
        1
      )
      let [r, g, b, a] = imgData.data
      a = parseFloat((a / 255).toFixed(2))
      // @ts-ignore
      const style = this.suckerPreview.style
      Object.assign(style, {
        position: 'absolute',
        left: clientX + 20 + 'px',
        top: clientY - 36 + 'px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid #fff',
        boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.16)',
        background: `rgba(${r}, ${g}, ${b}, ${a})`,
        zIndex: 95, // The level of the preview color of the small circle of the eyedropper cannot exceed the color selector
      })
      if (
        this.suckerArea.length &&
        // @ts-ignore
        clientX >= this.suckerArea[0] &&
        // @ts-ignore

        clientY >= this.suckerArea[1] &&
        // @ts-ignore

        clientX <= this.suckerArea[2] &&
        // @ts-ignore

        clientY <= this.suckerArea[3]
      ) {
        // @ts-ignore

        style.display = ''
      } else {
        // @ts-ignore
        style.display = 'none'
      }
    },
    suckColor(dom: any) {
      if (dom && dom.tagName !== 'CANVAS') {
        return
      }
      // @ts-ignore
      this.suckerPreview = document.createElement('div')
      // @ts-ignore
      if (this.suckerPreview) document.body.appendChild(this.suckerPreview)

      document.addEventListener('mousemove', this.mousemoveHandler)
      document.addEventListener('mouseup', this.mousemoveHandler)

      dom.addEventListener('click', (e: any) => {
        const { clientX, clientY } = e
        const { top, left, width, height } = dom.getBoundingClientRect()
        const x = clientX - left
        const y = clientY - top
        const ctx = dom.getContext('2d')
        const imgData = ctx.getImageData(
          Math.min(x, width - 1),
          Math.min(y, height - 1),
          1,
          1
        )
        let [r, g, b, a] = imgData.data
        a = parseFloat((a / 255).toFixed(2))
        this.$emit('selectSucker', { r, g, b, a })
      })
    },
  },
})
</script>

<style lang="scss">
.sucker {
  width: 30px;
  fill: #9099a4;
  background: #2e333a;
  cursor: pointer;
  transition: all 0.3s;
  &:hover,
  &.active {
    fill: #1593ff;
  }
}
</style>
