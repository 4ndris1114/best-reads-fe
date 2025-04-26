<template>
    <div class="p-4 rounded-xl bg-gray-100">
      <p><strong>{{ activity.userName }}</strong> added <strong>{{ activity.payload.bookTitle }}</strong> to their bookshelf.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{ activity: any }>();
  </script>
  