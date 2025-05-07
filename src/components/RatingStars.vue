<template>
  <div class="flex lg:space-x-5 md:space-x-2 sm:space-x-1 xs:space-x-0">
                        <fa
                        v-for="n in 5"
                        :key="n"
                        :icon="['fas', 'star']"
                        class="lg:scale-200 md:scale-150 sm:scale-125 cursor-pointer transition-colors duration-200"
                        :class="n <= hoveredStar ? 'text-yellow-500' : 'text-slate-300'"
                        @mouseover="setHovered(n)"
                        @mouseleave="resetHovered"
                        @click="clickedStar = n; showReviewModal = true" />
                    </div>
<LeaveReviewModal
            :isOpen="showReviewModal"
            :ratingValue="clickedStar"
            :reviewText="reviewText"
            :isPublic="isPublic"
            @submit="handleReviewSubmit"
            @close="showReviewModal = false"
        />
</template>
<script lang="ts" setup>
import LeaveReviewModal from '@/components/LeaveReviewModal.vue';
import { ref } from 'vue';

const hoveredStar = ref(0);
const clickedStar = ref(0);
const showReviewModal = ref(false);

const setHovered = (index: number) => {
  hoveredStar.value = index;
};
const resetHovered = () => {
  hoveredStar.value = 0;
};
</script>
<style scoped>
</style>
