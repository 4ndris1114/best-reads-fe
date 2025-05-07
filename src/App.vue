<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastNotification from './components/ToastNotification.vue';
</script>

<template>
    <ToastNotification />
<router-view :key="$route.fullPath" />
</template>

<style scoped>
</style>
