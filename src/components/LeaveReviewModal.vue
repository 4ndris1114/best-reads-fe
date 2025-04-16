<template>
    <transition name="fade">
        <div v-if="isOpen" @click.self="emit('close')"
            class="fixed inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-6 w-[90vw] max-w-md shadow-xl">
                <h2 class="text-2xl font-semibold text-highlight mb-2 text-center">Leave a Review</h2>

                <div class="flex justify-start mb-2 space-x-2 relative">
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
                </div>
                <div class="space-x-3.5 ml-2 mb-4">
                    <fa v-for="n in 5" :key="n" :icon="['fas', 'star']"
                        class="scale-175 transition-colors duration-200 cursor-pointer"
                        :class="n <= rating ? 'text-yellow-500' : 'text-gray-300'" @click="rating = n" />
                </div>

                <span class="text-sm text-gray-600">Any thoughts you want to share?</span>
                <textarea v-model="reviewText" placeholder="Write your review..."
                    class="w-full h-24 p-3 mt-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-highlight"></textarea>

                <span class="text-sm text-gray-600 mt-2">Who can see this review?</span>
                <div class="flex items-center justify-start space-x-4 mt-1">
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
                        class="bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer">
                        Cancel
                    </button>
                    <button @click="handleSubmit"
                        :class="['font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer', confirmingSubmit ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-highlight hover:bg-highlight-dark text-white']">
                        {{ confirmingSubmit ? 'Submit without text?' : 'Submit' }}
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

const confirmingSubmit = ref(false)
const showInfo = ref(false)

watch(() => props.ratingValue, (val) => {
    rating.value = val;
});

const handleSubmit = () => {
    if (reviewText.value.trim() === '') {
        if (!confirmingSubmit.value) {
            confirmingSubmit.value = true;
            setTimeout(() => confirmingSubmit.value = false, 5000); // auto-reset after 5s
            return;
        }
    }

    emit('submit', {
        rating: rating.value,
        reviewText: reviewText.value,
        isPublic: isPublic.value,
    });

    reviewText.value = '';
    confirmingSubmit.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>