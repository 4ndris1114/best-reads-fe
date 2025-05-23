<template>
<MainLayout>
    <div class="bookshelf-container bg-[#222C34] flex flex-col p-4 bookshelf h-screen overflow-y-scroll">
      <div class="bg-[#191B1D] rounded-3xl max-w-[820px] mx-auto bookshelf-container p-4 shadow-2xl rounded-lg">

        <div v-if="loading" class="text-center text-gray-600">Loading bookshelves...</div>
        <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

        <div v-else-if="selectedBookshelf">
          <div
            class="mb-10 shelf-label flex justify-center  items-center gap-2 drop-shadow-3xl py-2 px-4 rounded-3xl text-3xl font-extrabold">
            <!-- Bookshelf Title + Dropdown -->
            <button @click="toggleDropdown"
              class="relative flex items-center justify-center mr-2 w-auto text-[#3a281d] gap-2 bg-[#C67B2F] drop-shadow-3xl py-2 px-4 rounded-xl text-3xl font-extrabold hover:bg-[#825221] transition cursor-pointer">
              {{ selectedBookshelf.name }}
              <fa :icon="dropdownOpen ? 'chevron-up' : 'chevron-down'" class="ml-auto" />
              <!-- Dropdown List -->
              <div v-if="dropdownOpen"
                class="absolute w-full w-auto left-0 top-13 bg-gray-100 border border-black rounded-lg shadow-md z-50">
                <ul class="text-black text-lg">
                  <li v-for="shelf in bookshelves" :key="shelf.id" @click="selectBookshelf(shelf)"
                    class="px-4 py-2 text-left hover:bg-gray-200 cursor-pointer">
                    {{ shelf.name }}
                  </li>
                  <li @click="openShelfModal"
                    class="px-4 py-2 text-left text-green-700 font-semibold hover:bg-gray-200 cursor-pointer">
                    Create New Bookshelf
                  </li>
                </ul>
              </div>
            </button>

            <!-- Settings Button -->
            <button v-if="selectedBookshelf.isMutable" @click="toggleSettings"
              class="absolute right-11 bg-gray-600 text-white p-2 rounded-xl drop-shadow-xl hover:bg-gray-500 cursor-pointer">
              <fa icon="cog" />
            </button>

            <!-- Settings Dropdown -->
            <div v-if="settingsOpen" class="absolute right-6 top-16 bg-white border border-black rounded-lg z-50">
              <ul class="text-black text-lg">

                <li @click="renameBookshelf(selectedBookshelf.name)" class="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  Rename Bookshelf
                </li>
                <li @click="deleteBookshelf(selectedBookshelf)"
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
          <button v-if="bookshelves.length > 1" @click="swipeToNextBookshelf(-1)"
            class="scale-175 text-white bg-[#9F6932] mr-auto p-1 rounded-lg hover:bg-[#825221] cursor-pointer">
            <fa icon="chevron-left" />
          </button>

          <!-- Bookshelf Component -->
          <div class="flex justify-center items-center w-2/3">
            <Bookshelf v-if="selectedBookshelf" :key="selectedBookshelf.id" :shelf="selectedBookshelf"
              @openModal="openModal" />
          </div>

          <!-- Right Arrow -->
          <button v-if="bookshelves.length > 1" @click="swipeToNextBookshelf(1)"
            class="scale-175 text-white bg-[#9F6932] p-1 ml-auto rounded-lg hover:bg-[#825221] cursor-pointer">
            <fa icon="chevron-right" />
          </button>
        </div>

        <!-- Modals -->
        <BookModal :book="selectedBook" :isVisible="isModalVisible" @closeModal="closeModal" />
        <NewBookshelfModal :isShelfVisible="isShelfVisible" @closeShelfModal="closeShelfModal"
          v-on-click-outside="closeShelfModal"
          @bookshelfCreated="showNewBookshelf" />
        <RenameBookshelfModal :isVisible="isRenameModalVisible" :currentName="selectedBookshelf?.name || ''"
          :bookshelfId="selectedBookshelf?.id || ''" @closeModal="isRenameModalVisible = false" />
        <DeleteBookshelfModal :isVisible="isDeleteModalVisible" :bookshelfId="selectedBookshelf?.id || ''"
          @closeModal="isDeleteModalVisible = false" @deleteBookshelf="handleDeleteBookshelf" />
        <EditProgressModal :isVisible="isEditProgressModalOpen" :readingProgress="readingProgress"
          @closeModal="isEditProgressModalOpen = false" @progressUpdated="handleProgressUpdate" />
        <LeaveReviewModal :isVisible="isLeaveReviewModalVisible" :book="selectedBook" @closeModal="isLeaveReviewModalVisible = false" />
      </div>
    </div>
</MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import BookModal from '@/components/BookModal.vue';
import NewBookshelfModal from '@/components/NewBookshelfModal.vue';
import RenameBookshelfModal from '@/components/RenameBookshelfModal.vue';
import DeleteBookshelfModal from '@/components/DeleteBookshelfModal.vue';
import EditProgressModal from '@/components/EditProgressModal.vue';
import LeaveReviewModal from '@/components/LeaveReviewModal.vue';
import Bookshelf from '@/components/Bookshelf.vue';
import type { IBook } from '@/types/interfaces/IBook';
import { useBookStore } from '@/stores/bookStore';
import { useShelfStore } from '@/stores/shelfStore';
import { useUserStore } from '@/stores/userStore';
import type { IBookshelf } from '@/types/interfaces/IBookshelf';
import MainLayout from '@/layouts/MainLayout.vue';


const bookStore = useBookStore();
const shelfStore = useShelfStore();
const userStore = useUserStore();

const isDeleteModalVisible = ref(false);
const isRenameModalVisible = ref(false);
const isModalVisible = ref(false);
const isShelfVisible = ref(false);
const isEditProgressModalOpen = ref(false);
const isLeaveReviewModalVisible = ref(false);
const readingProgress = ref<IReadingProgress | null>(null);

const dropdownOpen = ref(false);
const settingsOpen = ref(false);

const loading = computed(() => shelfStore.loading);
const error = ref<string | null>(null);

const bookshelves = computed(() => shelfStore.bookshelves || []);
const selectedBookshelf = ref<IBookshelf | null>(bookshelves.value.length > 0 ? bookshelves.value[0] : null);
const selectedBook = ref<IBook | null>(null);

const swipeToNextBookshelf = (increment: number) => {
  const currentIndex = bookshelves.value.findIndex((shelf) => shelf.id === selectedBookshelf.value?.id);
  let nextIndex = (currentIndex + increment) % bookshelves.value.length;
  if (nextIndex < 0) nextIndex = bookshelves.value.length - 1;
  if (currentIndex === -1) nextIndex = 0;
  selectedBookshelf.value = bookshelves.value[nextIndex];
};

const selectBookshelf = (shelf: IBookshelf) => {
  selectedBookshelf.value = shelf;
  dropdownOpen.value = false;
};

const toggleDropdown = () => {
  settingsOpen.value = false;
  dropdownOpen.value = !dropdownOpen.value;
};

const toggleSettings = () => {
  dropdownOpen.value = false;
  settingsOpen.value = !settingsOpen.value;
};

const showNewBookshelf = () => {
  selectedBookshelf.value = bookshelves.value[bookshelves.value.length - 1];
};

const renameBookshelf = (newName: string) => {
  settingsOpen.value = false;
  isRenameModalVisible.value = true;
};
const handleRenameBookshelf = async (newName: string) => {
  if (!selectedBookshelf.value) return;
  await shelfStore.renameBookshelf(userStore.loggedInUser!.id, selectedBookshelf.value.id, newName);
  isRenameModalVisible.value = false;
};

const deleteBookshelf = (shelf: IBookshelf) => {
  settingsOpen.value = false;
  isDeleteModalVisible.value = true;
}

const handleDeleteBookshelf = () => {
  isDeleteModalVisible.value = false;
  swipeToNextBookshelf(-1);
}

const handleProgressUpdate = async (updatedProgress: IReadingProgress) => {
  try {
    await userStore.editReadingProgressById(
      userStore.loggedInUser!.id,
      updatedProgress.id,
      updatedProgress
    );

    // Update selected progress
    selectedProgress.value = updatedProgress;
    isEditProgressModalVisible.value = false;

    // Open review modal if book is finished
    if (updatedProgress.currentPage >= updatedProgress.totalPages) {
      isLeaveReviewModalOpen.value = true;
    }
  } catch (error) {
    console.error('Failed to update progress:', error);
  }
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
<style scoped></style>
