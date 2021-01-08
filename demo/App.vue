<template>
  <div :style="{ background: color }" class="container">
    <div class="color-picker-container">
      <div>Color Picker</div>
      <ColorPicker
        v-model="color"
        :color="color"
        @changeColor="changeColor"
        @openSucker="openSucker"
        :sucker-hide="false"
        :sucker-canvas="suckerCanvas"
        :sucker-area="suckerArea"
        @selectColor="selectColor"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ColorPicker } from '/@/'
export default defineComponent({
  components: { ColorPicker },
  setup() {
    const color = ref('#1BC7B1')
    const suckerCanvas = ref(null)
    const suckerArea = ref([])
    const isSucking = ref(false)
    function changeColor(value) {
      console.log(value)
      color.value = value.hex
    }
    function openSucker(value) {
      console.log(value)
    }
    function selectColor(value) {
      console.log(value)
    }
    return {
      color,
      changeColor,
      openSucker,
      suckerCanvas,
      suckerArea,
      isSucking,
      selectColor,
    }
  },
})
</script>

<style>
body {
  margin: 0;
}
.container {
  height: 100vh;
  width: 100%;
  margin: auto;
}
.color-picker-container {
  max-width: 300px;
  width: 300px;
}
</style>
