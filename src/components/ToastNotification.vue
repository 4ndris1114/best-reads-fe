<template>
    <div v-if="show" class="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 z-[9999]"
        :class="toastType === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'">
        <fa :icon="toastType === 'error' ? 'exclamation-circle' : 'check-circle'"
            :class="toastType === 'error' ? 'text-red-500' : 'text-green-500'" />
        <p class="text-sm text-gray-600">{{ message }}</p>
    </div>
</template>

<script setup>
console.log("Toast Notification");
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    toastType: {
        type: String,
        default: 'success', // 'success' or 'error'
    },
    message: {
        type: String,
        required: true,
    },
})
</script>