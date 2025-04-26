<template>
    <div class="p-4 rounded-xl bg-gray-100">
      <p><strong>{{ activity.userName }}</strong> rated <strong>{{ activity.payload.bookTitle }}</strong> as <strong>{{ activity.payload.rating }} stars</strong>.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{ activity: any }>();
  </script>
  