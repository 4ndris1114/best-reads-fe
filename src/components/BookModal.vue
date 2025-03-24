<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <button @click="close" class="modal-close">Close</button>
      <h2 class="text-xl font-bold">{{ book.title }}</h2>
      <p><strong>Author:</strong> {{ book.author }}</p>
      <p><strong>ISBN:</strong> {{ book.isbn }}</p>
      <p><strong>Published Date:</strong> {{ book.publishedDate }}</p>
      <p><strong>Genres:</strong> {{ book.genres.join(", ") }}</p>
      <p><strong>Average Rating:</strong> {{ book.averageRating }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  book: Object,
  isVisible: Boolean,
});

const emit = defineEmits(['closeModal']);

const close = () => {
  emit('closeModal');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
}

.modal-close {
  background-color: red;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.modal-close:hover {
  background-color: darkred;
}
</style>
