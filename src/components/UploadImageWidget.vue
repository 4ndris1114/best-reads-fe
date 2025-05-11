<template>
    <div
      class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center z-50"
      @click.self="close"
    >
      <div class="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
        <h2 class="text-xl font-semibold mb-4">Upload Profile Image</h2>
  
        <div class="mb-4">
          <input
            type="file"
            accept="image/*"
            ref="fileInput"
            class="hidden"
            @change="handleFileChange"
          />
          <div
            class="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden"
          >
            <img v-if="previewUrl" :src="previewUrl" alt="Preview" class="object-cover w-full h-full" />
            <span v-else class="text-gray-400">No image</span>
          </div>
        </div>
  
        <div class="space-x-2 mt-4">
          <button
            @click="triggerFileDialog"
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Choose Image
          </button>
          <button
            @click="upload"
            :disabled="!selectedFile"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const fileInput = ref(null);
  const selectedFile = ref(null);
  const previewUrl = ref(null);
  
  const emit = defineEmits(['uploaded', 'close']);
  
  function triggerFileDialog() {
    fileInput.value?.click();
  }
  
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      selectedFile.value = file;
      previewUrl.value = URL.createObjectURL(file);
    }
  }
  
  function upload() {
    if (!selectedFile.value) return;
    emit('uploaded', selectedFile.value);
    close();
  }
  
  function close() {
    emit('close');
  }
  
  onMounted(() => {
    // Open dialog automatically on mount
    triggerFileDialog();
  });
  </script>
  
  <style scoped>
  /* Optional: Add fade-in animation */
  </style>
  