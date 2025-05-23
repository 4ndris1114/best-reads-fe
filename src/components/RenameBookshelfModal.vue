<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex justify-center items-center z-50">
    <div class="bg-white relative border-2 border-green-600 p-4 rounded-lg w-[300px]">
      <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-md">
        <fa icon="pen" class="text-green-600 text-2xl" />
      </div>

      <h2 class="text-xl font-bold my-4">Rename Bookshelf</h2>
      <input v-model="newName" class="border w-full p-2 mb-4" />
      <div class="flex justify-center gap-7">
        <button @click="emits('closeModal')" class="bg-gray-400 px-3 py-1 rounded hover:bg-gray-600 cursor-pointer">Cancel</button>
        <button @click="confirmRename" class="bg-green-600 text-white px-3 hover:bg-green-800 py-1 rounded cursor-pointer">Rename</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useShelfStore } from '@/stores/shelfStore';
import { useUserStore } from '@/stores/userStore';

const shelfStore = useShelfStore();
const userStore = useUserStore();

const props = defineProps<{
  isVisible: boolean;
  bookshelfId: string;
}>();

const emits = defineEmits(['closeModal']);

// Get the bookshelf from the store using the ID
const currentShelf = computed(() =>
  shelfStore.bookshelves.find((b) => b.id === props.bookshelfId)
);

// Use a ref for the input, starting with the current shelf name
const newName = ref('');

// When isVisible becomes true, reset the input to the current name
watch(
  () => props.isVisible,
  (visible) => {
    if (visible && currentShelf.value) {
      newName.value = currentShelf.value.name;
    }
  },
  { immediate: true }
);

// Method to confirm renaming
const confirmRename = () => {
  try {
    if (!newName.value.trim()) return;
    shelfStore.renameBookshelf(
      userStore.loggedInUser!.id,
      props.bookshelfId,
      newName.value.trim()
    );
    emits('closeModal', newName.value.trim());
  } catch (error) {
    console.error('Error renaming bookshelf:', error);
  }
};
</script>
