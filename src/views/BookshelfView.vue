<template>
  <div>
    <Navbar />
    <div class="bookshelf-container bg-[rgb(38,38,48)] flex flex-col items-center justify-center p-4 bookshelf h-screen">
      <div class="bookshelf-container p-4 h-[calc(100%-4rem)]">
        <div v-if="loading" class="text-center text-gray-600">Loading bookshelves...</div>
        <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

        <div v-else-if="selectedBookshelf">
          <div class="mt-20 shelf-label flex items-center justify-center w-full relative">            <!-- Bookshelf Title + Dropdown -->
            <button @click="toggleDropdown"
                    class="relative flex items-center gap-2 bg-[#9F6932] py-2 px-4 rounded-3xl border-4 border-[#522623] text-3xl font-extrabold text-black-900 hover:bg-[#af7c3a] transition w-[250px] cursor-pointer">
              {{ selectedBookshelf.name }}
              <fa :icon="dropdownOpen ? 'chevron-up' : 'chevron-down'" class="ml-auto" />
                          <!-- Dropdown List -->
            <div v-if="dropdownOpen"
                 class="absolute left-0 bottom-0 mt-2 bg-white border border-black rounded-lg shadow-md w-[250px] z-50">
              <ul class="text-black text-lg">
                <li v-for="shelf in bookshelves" :key="shelf.id"
                    @click="selectBookshelf(shelf)"
                    class="px-4 py-2  hover:bg-gray-200 cursor-pointer">
                  {{ shelf.name }}
                </li>
                <li @click="openShelfModal"
                    class="px-4 py-2 text-green-700 font-semibold hover:bg-gray-200 cursor-pointer">
                  + Create New Bookshelf
                </li>
              </ul>
            </div>
            </button>

            <!-- Settings Button -->
            <button @click="toggleSettings"
                    class="absolute right-6 top-6 bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 cursor-pointer">
              <fa icon="cog" />
            </button>

            <!-- Settings Dropdown -->
            <div v-if="settingsOpen"
                 class="absolute right-6 top-16 bg-white border border-black rounded-lg shadow-md w-[200px] z-50">
              <ul class="text-black text-lg">

                <li @click="renameBookshelf"
                    class="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                 Rename Bookshelf
                </li>
                <li @click="deleteBookshelf"
                    class="px-4 py-2 text-red-600 font-semibold hover:bg-gray-200 cursor-pointer">
                  Delete Bookshelf
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="text-center text-gray-600">No bookshelves found. Please add a bookshelf.</div>
        </div>

        <div class="flex justify-center items-center mt-4 gap-4">
          <!-- Left Arrow -->
          <button @click="swipeToNextBookshelf(-1)"
                  class="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-500 cursor-pointer">
            <fa icon="chevron-left" />
          </button>

          <!-- Bookshelf Component -->
          <div class="flex justify-center items-center w-2/3">
            <Bookshelf v-if="selectedBookshelf" :key="selectedBookshelf.id" :shelf="selectedBookshelf"
                       @openModal="openModal" />
          </div>

          <!-- Right Arrow -->
          <button @click="swipeToNextBookshelf(1)"
                  class="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-500 cursor-pointer">
            <fa icon="chevron-right" />
          </button>
        </div>

        <!-- Modals -->
        <BookModal :book="selectedBook" :isVisible="isModalVisible" @closeModal="closeModal" />
        <NewBookshelfModal :isShelfVisible="isShelfVisible" @closeShelfModal="closeShelfModal"
                           @bookshelfCreated="showNewBookshelf" />
        <RenameBookshelfModal :isVisible="isRenameVisible" :currentName="selectedBookshelf?.name || ''" @close="isRenameVisible = false" @rename="handleRenameBookshelf" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import BookModal from '@/components/BookModal.vue';
import NewBookshelfModal from '@/components/NewBookshelfModal.vue';
import RenameBookshelfModal from '@/components/RenameBookshelfModal.vue';
import Bookshelf from '@/components/Bookshelf.vue';
import type { IBook } from '@/types/interfaces/IBook';
import { useBookStore } from '@/stores/bookStore';
import { useShelfStore } from '@/stores/shelfStore';
import { useUserStore } from '@/stores/userStore';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';

const loading = computed(() => shelfStore.loading);
const error = ref<string | null>(null);
const selectedBook = ref<IBook | null>(null);
const bookStore = useBookStore();
const isModalVisible = ref(false);
const isShelfVisible = ref(false);
const dropdownOpen = ref(false);
const settingsOpen = ref(false);
const shelfStore = useShelfStore();
const userStore = useUserStore();
const bookshelves = computed(() => shelfStore.bookshelves || []);
const selectedBookshelf = ref<IBookshelf | null>(bookshelves.value.length > 0 ? bookshelves.value[0] : null);

const swipeToNextBookshelf = (increment: number) => {
  const currentIndex = bookshelves.value.findIndex((shelf) => shelf.id === selectedBookshelf.value?.id);
  let nextIndex = (currentIndex + increment) % bookshelves.value.length;
  if (nextIndex < 0) nextIndex = bookshelves.value.length - 1;
  selectedBookshelf.value = bookshelves.value[nextIndex];
};

const selectBookshelf = (shelf: IBookshelf) => {
  selectedBookshelf.value = shelf;
  dropdownOpen.value = false;
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const toggleSettings = () => {
  settingsOpen.value = !settingsOpen.value;
};

const renameBookshelf = () => {
  settingsOpen.value = false;
  isRenameVisible.value = true;
};

const deleteBookshelf = () => {
  console.log("Delete bookshelf...");
  settingsOpen.value = false;
};

const showNewBookshelf = () => {
  selectedBookshelf.value = bookshelves.value[bookshelves.value.length - 1];
};

const isRenameVisible = ref(false);

const handleRenameBookshelf = async (newName: string) => {
  if (!selectedBookshelf.value) return;
  await shelfStore.renameBookshelf(userStore.loggedInUser!.id, selectedBookshelf.value.id, newName);
  isRenameVisible.value = false;
};


const openModal = (book: IBook) => {
  selectedBook.value = book;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const openShelfModal = () => {
  isShelfVisible.value = true;
  dropdownOpen.value = false;
};

const closeShelfModal = () => {
  isShelfVisible.value = false;
};

// Close dropdowns on click outside
const closeDropdowns = (e: MouseEvent) => {
  if (dropdownOpen.value && !e.target!.closest('.shelf-label')) {
    dropdownOpen.value = false;
  }
  if (settingsOpen.value && !e.target!.closest('.shelf-label')) {
    settingsOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdowns);
});
</script>
