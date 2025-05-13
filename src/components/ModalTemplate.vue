<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="emit('closeModal')">
    <div :class="['relative bg-white p-6 pt-10 rounded-lg w-[400px] shadow-lg border-t-4', frameColor]">
      <!-- Icon -->
      <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
        <fa :icon="icon" class="text-2xl" :class="frameColor" />
      </div>

      <!-- Text Content -->
      <p class="text-center text-lg font-medium text-gray-800">{{ text }}</p>

      <!-- Buttons -->
      <div class="flex justify-center gap-4 mt-6">
        <button
          @click="leftButtonAction"
          class="w-28 px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 transition"
        >
          {{ leftButtonText }}
        </button>
        <button
          @click="rightButtonAction"
          :class="['w-28 px-4 py-2 text-white font-semibold rounded transition', frameColor, hoverColor]"
        >
          {{ rightButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  frameColor: string; // example: "border-blue-700", "text-red-600"
  text: string;
  leftButtonText: string;
  leftButtonAction: () => void;
  rightButtonText: string;
  rightButtonAction: () => void;
  isOpen: boolean;
}>();

const emit = defineEmits(['closeModal']);

// For hover variant matching frameColor
const hoverColor = computed(() => {
  if (props.frameColor.includes('blue')) return 'hover:bg-blue-800';
  if (props.frameColor.includes('red')) return 'hover:bg-red-700';
  if (props.frameColor.includes('green')) return 'hover:bg-green-700';
  return 'hover:opacity-80';
});
</script>
<style scoped></style>
