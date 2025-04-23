<template>
  <div class="w-full max-w-md mx-auto p-4">
    <div class="relative w-full h-6 bg-gray-200 rounded-full">
      <div
        class="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out"
        :style="barStyle">
      </div>
    </div>
    <div class="text-center mt-2 text-sm text-gray-700">
      <span>{{ currentPage }} / {{ totalPages }} pages</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    barStyle() {
      // Calculate the progress percentage and set width accordingly
      const progress = (this.currentPage / this.totalPages) * 100;
      return {
        width: `${Math.min(progress, 100)}%`
      };
    }
  }
};
</script>

<style scoped></style>
