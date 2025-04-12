<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center flex justify-center items-center bg-black">
    <div class="bg-white p-4 rounded-lg w-[300px] z-50">
      <h2 class="text-xl font-bold mb-2">Rename Bookshelf</h2>
      <input v-model="newName" class="border w-full p-2 mb-4" />
      <div class="flex justify-end gap-2">
        <button @click="emits('closeModal')" class="bg-gray-400 px-3 py-1 rounded cursor-pointer">Cancel</button>
        <button @click="confirmRename" class="bg-green-600 text-white px-3 py-1 rounded cursor-pointer">Rename</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useShelfStore } from '@/stores/shelfStore';
import { useUserStore } from '@/stores/userStore';

const shelfStore = useShelfStore();
const userStore = useUserStore();

const props = defineProps<{
  isVisible: boolean;
  currentName: string;
  bookshelfId: string;
}>();

const newName = ref(props.currentName);
const emits = defineEmits(['closeModal']);

// Method to confirm renaming
const confirmRename = () => {
  try{
    shelfStore.renameBookshelf(userStore.loggedInUser!.id, props.bookshelfId, newName.value);
  if (!newName.value.trim()) return; // Don't emit if input is empty or just spaces
  emits('closeModal', newName.value.trim());
  }catch (error) {
    console.error('Error renaming bookshelf:', error);
  }
};
</script>
