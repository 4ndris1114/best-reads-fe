<template>
    <transition name="fade">
        <div v-if="isOpen"
            class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-6 w-[90vw] max-w-md shadow-xl">
                <h2 class="text-2xl font-semibold text-highlight mb-4 text-center">Leave a Review</h2>

                <div class="flex justify-start mb-4 space-x-2 relative">
                    <div class="relative">
                        <fa icon="info-circle" class="text-sm text-gray-600 mr-2 cursor-pointer"
                            @click="showInfo = !showInfo" @mouseenter="showInfo = true"
                            @mouseleave="showInfo = false" />
                        <span class="text-sm text-gray-600">Your rating: </span>

                        <!-- Tooltip -->
                        <div v-if="showInfo"
                            class="absolute top-full left-0 w-64 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg z-10">
                            Click on the stars to change your rating for this book.
                        </div>
                    </div>

                    <div class="space-x-2 ml-2">
                        <fa v-for="n in 5" :key="n" :icon="['fas', 'star']"
                            class="scale-150 transition-colors duration-200 cursor-pointer"
                            :class="n <= rating ? 'text-yellow-500' : 'text-gray-300'" @click="rating = n" />
                    </div>
                </div>

                <textarea v-model="reviewText" placeholder="Write your review..."
                    class="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-highlight"></textarea>

                <div class="flex items-center justify-between mt-4">
                    <label class="flex items-center space-x-2">
                        <input type="radio" value="true" v-model="isPublic" class="accent-highlight" />
                        <span>Public</span>
                    </label>
                    <label class="flex items-center space-x-2">
                        <input type="radio" value="false" v-model="isPublic" class="accent-highlight" />
                        <span>Private</span>
                    </label>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="$emit('close')"
                        class="bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-lg transition-all duration-200">
                        Cancel
                    </button>
                    <button @click="handleSubmit"
                        class="bg-highlight hover:bg-highlight-dark text-white font-medium px-4 py-2 rounded-lg transition-all duration-200">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    isOpen: boolean;
    ratingValue: number;
}>();

const emit = defineEmits<{
    (e: 'submit', payload: { rating: number; reviewText: string; isPublic: boolean }): void;
    (e: 'close'): void;
}>();

const rating = ref<number>(props.ratingValue);
const reviewText = ref('');
const isPublic = ref(true);
const showInfo = ref(false)

watch(() => props.ratingValue, (val) => {
    rating.value = val;
});

const handleSubmit = () => {
    if (reviewText.value.trim() === '') return;
    emit('submit', {
        rating: rating.value,
        reviewText: reviewText.value,
        isPublic: isPublic.value,
    });
    reviewText.value = '';
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>