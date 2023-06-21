<template>
  <div class="color-type">
    <span class="name">
      {{ name }}
    </span>
    <input
      v-model="modelColor"
      class="value"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
  },
  emits: ['inputColor', 'inputFocus', 'inputBlur'],
  setup(props, { emit }) {
    const modelColor = computed({
      get() {
        return props.color || ''
      },
      set(val) {
        emit('inputColor', val)
      },
    })

    // Functions for handling focus events
    const handleFocus = (event: FocusEvent) => {
      emit('inputFocus', event)
    }
    const handleBlur = (event: FocusEvent) => {
      emit('inputBlur', event)
    }
    return {
      modelColor,
      handleFocus,
      handleBlur,
    }
  },
})
</script>

<style lang="scss">
.color-type {
  display: flex;
  margin-top: 8px;
  font-size: 12px;
  .name {
    width: 60px;
    height: 30px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    background: #252930;
  }
  .value {
    flex: 1;
    height: 30px;
    min-width: 100px;
    padding: 0 12px;
    border: 0;
    color: #fff;
    background: #2e333a;
    box-sizing: border-box;
  }
}
</style>
