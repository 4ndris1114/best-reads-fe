<template>
    <div class="fixed drop-shadow-lg inset-0 bg-black/[var(--bg-opacity)] [--bg-opacity:50%] flex justify-center items-center z-50"
        @click.self="emits('closeModal')">
        <div v-if="localReadingChallenge" class="relative bg-white p-6 pt-10 rounded-lg w-[300px] border border-primary shadow-lg">
            <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md">
                <fa icon="pencil" class="text-primary text-2xl" />
            </div>

            <h2 class="text-xl font-semibold text-center mb-2">Update Your Goal</h2>

            <div class="mb-6">
                <label for="currentPage" class="block mb-2 font-semibold">Current Goal:</label>
                <input id="currentPage" type="number" v-model.number="localReadingChallenge.goal"
                    class="w-full px-3 py-2 border border-gray-300 rounded" min="0" />
            </div>

            <div class="flex justify-center gap-6">
                <button @click="emits('closeModal')"
                    class="w-24 px-3 py-2 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 transition">
                    Cancel
                </button>
                <button @click="readingChallenge ? emits('update', localReadingChallenge) : emits('create', localReadingChallenge)"
                    class="w-24 px-3 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition">
                    {{ readingChallenge ? 'Update' : 'Create'}}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IReadingChallenge } from '@/types/interfaces/IReadingChallenge';
import { ref } from 'vue';

const props = defineProps<{
    readingChallenge: IReadingChallenge | null;
}>()

const localReadingChallenge = ref<IReadingChallenge | null>({ ...props.readingChallenge! });

const emits = defineEmits<{
    (e: 'closeModal'): void;
    (e: 'update', payload: IReadingChallenge): void;
    (e: 'create', payload: IReadingChallenge): void;
}>();
</script>