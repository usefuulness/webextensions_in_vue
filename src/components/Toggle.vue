<template>
  <div class="toggle-component">
    <label class="flex items-center cursor-pointer">
      <div class="relative">
        <input
          type="checkbox"
          class="sr-only"
          :checked="modelValue"
          @change="updateValue($event.target.checked)"
        />
        <div
          class="block w-10 h-6 rounded-full transition-colors duration-200"
          :class="modelValue ? 'bg-primary' : 'bg-gray-300'"
        ></div>
        <div
          class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"
          :class="modelValue ? 'transform translate-x-4' : ''"
        ></div>
      </div>
      <div v-if="label" class="ml-3 text-gray-700">
        {{ label }}
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Toggle',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const updateValue = (checked: boolean): void => {
      if (!props.disabled) {
        emit('update:modelValue', checked);
      }
    };

    return {
      updateValue
    };
  }
});
</script>
