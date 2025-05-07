<template>
  <div class="h-screen flex flex-col">
    <Navbar />
    <!-- pt-16 because navbar is h-16 -->
    <div class="flex-1 overflow-y-hidden pt-16">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';

import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toastStore'
</script>

<style scoped>
</style>
