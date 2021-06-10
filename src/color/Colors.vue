<template>
  <div>
    <ul class="colors">
      <li
        v-for="item in colorsDefault"
        :key="item"
        class="item"
        @click="selectColor(item)"
      >
        <div :style="{ background: `url(${imgAlphaBase64})` }" class="alpha" />
        <div :style="{ background: item }" class="color" />
      </li>
    </ul>
    <ul v-if="colorsHistory.length" class="colors history">
      <li
        v-for="item in colorsHistory"
        :key="item"
        class="item"
        @click="selectColor(item)"
      >
        <div :style="{ background: `url(${imgAlphaBase64})` }" class="alpha" />
        <div :style="{ background: item }" class="color" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue'
import { createAlphaSquare } from './composible'
export default defineComponent({
  name: 'ColorPicker',
  props: {
    color: {
      type: String,
      default: '#000000',
    },
    colorsDefault: {
      type: Array,
      default: () => [],
    },
    colorsHistoryKey: {
      type: String,
      default: '',
    },
  },
  emits: ['selectColor'],
  setup(props, { emit }) {
    const color = ref()
    const colorsHistory = ref([])
    const imgAlphaBase64 = ref()
    if (props.colorsHistoryKey && localStorage) {
      colorsHistory.value =
        JSON.parse(localStorage.getItem(props.colorsHistoryKey) as string) || []
    }

    imgAlphaBase64.value = createAlphaSquare(4).toDataURL()

    onUnmounted(() => {
      setColorsHistory(color.value)
    })

    function setColorsHistory(color: string) {
      if (!color) {
        return
      }
      const colors = colorsHistory.value || []
      // @ts-ignore
      const index = colors.indexOf(color)
      if (index >= 0) {
        colors.splice(index, 1)
      }
      if (colors.length >= 8) {
        colors.length = 7
      }
      // @ts-ignore
      colors.unshift(color)
      colorsHistory.value = colors || []
      if (localStorage && props.colorsHistoryKey)
        localStorage.setItem(props.colorsHistoryKey, JSON.stringify(colors))
    }
    function selectColor(color: any) {
      emit('selectColor', color)
    }

    return {
      setColorsHistory,
      colorsHistory,
      color,
      imgAlphaBase64,
      selectColor,
    }
  },
})
</script>
<style lang="scss">
.colors {
  padding: 0;
  margin: 0;
  &.history {
    margin-top: 10px;
    border-top: 1px solid #2e333a;
  }
  .item {
    position: relative;
    width: 16px;
    height: 16px;
    margin: 10px 0 0 10px;
    border-radius: 3px;
    box-sizing: border-box;
    vertical-align: top;
    display: inline-block;
    transition: all 0.1s;
    cursor: pointer;
    &:nth-child(8n + 1) {
      margin-left: 0;
    }
    &:hover {
      transform: scale(1.4);
    }
    .alpha {
      height: 100%;
      border-radius: 4px;
    }
    .color {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }
}
</style>
