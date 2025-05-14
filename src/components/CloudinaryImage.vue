<template>
  <img
    :src="imageUrl"
    :alt="alt"
    loading="lazy"
    @error="onError"
    :class="imageClass"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  publicId: string;
  alt?: string;
  width?: number;
  height?: number;
  transformations?: string[];
  class?: string;
  isUserImage?: boolean;
}>();

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const defaultTransformations = computed(() => [
  `w_${props.width ?? 300}`,
  `h_${props.height ?? 450}`,
  'c_fill',
  'q_auto',
  'f_auto',
  ...(props.transformations ?? [])
]);

const imageUrl = computed(() =>
  `https://res.cloudinary.com/${cloudName}/image/upload/${defaultTransformations.value.join(',')}/${props.isUserImage ? 'users' : ''}/${props.publicId === '' ? "default_book_cover" : props.publicId}`
);

const onError = (event: Event) => {
  (event.target as HTMLImageElement).src = '/images/fallback.jpg';
};

const imageClass = computed(() => props.class || 'object-cover'); // Default fallback class
</script>
