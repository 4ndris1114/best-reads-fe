<template>
  <div v-if="isVisible" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-4 rounded-lg w-[300px]">
      <h2 class="text-xl font-bold mb-2">Rename Bookshelf</h2>
      <input v-model="newName" class="border w-full p-2 mb-4" />
      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="bg-gray-400 px-3 py-1 rounded cursor-pointer">Cancel</button>
        <button @click="confirmRename" class="bg-green-600 text-white px-3 py-1 rounded cursor-pointer">Rename</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  currentName: string;
}>();

const emits = defineEmits<{
  close: () => void;
  rename: (newName: string) => void;
}>();

const newName = ref(props.currentName);

watch(() => props.currentName, (newVal) => {
  newName.value = newVal;
});

const confirmRename = () => {
  if (!newName.value.trim()) return;
  emits('rename', newName.value.trim());
};
</script>
