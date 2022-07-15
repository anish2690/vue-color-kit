<template>
  <div class="color-type">
    <span class="name">
      {{ name }}
    </span>
    <input :disabled="disableInputField" v-model="modelColor" class="value" />
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
    disableInputField: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['inputColor'],
  setup(props, { emit }) {
    const modelColor = computed({
      get() {
        return props.color || ''
      },
      set(val) {
        emit('inputColor', val)
      },
    })
    return {
      modelColor,
    }
  },
})
</script>

<style lang="scss" scoped>
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
