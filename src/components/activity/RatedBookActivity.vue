<template>
  <div v-if="user" class="flex items-start space-x-4">
    <!-- Profile Image -->
    <div class="flex-shrink-0">
      <div class="cursor-pointer" @click="$router.push({ name: 'profilepage', params: { id: user.id } })">
        <CloudinaryImage
          :publicId="user.profilePicture"
          :isUserImage="true"
          alt="User profile image"
          :width="50"
          :height="50"
          class="w-20 h-20 rounded-full object-cover"
        />
      </div>
    </div>

    <!-- Text Content -->
    <div class="flex-1">
      <p class="text-sm text-gray-500">
        {{ new Date(activity.createdAt).toLocaleDateString() }} at
        {{ new Date(activity.createdAt).toLocaleTimeString() }}
      </p>
      <p class="mt-1 space-y-6">
        <span @click="$router.push({ name: 'profilepage', params: { id: user.id } })" class="font-bold text-black cursor-pointer">{{ user.username }}</span>
        <span class="text-gray-700"> {{ activity.payload.isUpdate ? ' updated their rating of ' : ' rated ' }} </span>
        <span class="font-semibold text-accent">"{{ activity.payload.bookTitle }}"</span>
        <br />
        <div class="lg:space-x-4 md:space-x-2.5 sm:space-x-2 mt-1.5">
          <fa 
            v-for="n in Math.floor(activity.payload.rating)"
            :key="n"
            :icon="['fas', 'star']" 
            class="lg:scale-175 md:scale-150 sm:scale-150 cursor-pointer transition-colors duration-200"
            :class="n <= Math.floor(activity.payload.rating) ? 'text-yellow-500' : 'text-slate-300'"
          />
        </div>
        <span class="text-gray-700">
          {{ isShowingMore ? activity.payload.reviewText : activity.payload.reviewText.length > 100 
             ? activity.payload.reviewText.substring(0, 100) + '...' 
             : activity.payload.reviewText }}
        </span>
        <span @click="isShowingMore = !isShowingMore" class="text-slate-900 font-semibold cursor-pointer" v-if="activity.payload.reviewText.length > 100"> Read {{ isShowingMore ? 'less' : 'more' }}</span>
      </p>
    </div>

    <!-- Book Cover (Justified Right) -->
    <div class="flex-shrink-0 self-start">
      <CloudinaryImage class="sm:block hidden"
        v-if="activity.payload.coverImage"
        :publicId="activity.payload.coverImage"
        alt="Book cover"
        :width="120"
        :height="180"
      />
      <CloudinaryImage class="sm:hidden block"
          v-if="activity.payload.coverImage"
          :publicId="activity.payload.coverImage"
          alt="Book cover"
          :width="80"
          :height="130"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import CloudinaryImage from '../CloudinaryImage.vue';
import type { IUser } from '@/types/interfaces/IUser';
import { onMounted, ref } from 'vue';
import type { IActivity } from '@/types/interfaces/IActivity';

const props = defineProps<{ activity: IActivity }>();

const userStore = useUserStore();

const user = ref<IUser | null>(null);
const isShowingMore = ref(false);

onMounted(async () => {
  user.value = await userStore.getUserById(props.activity.userId);
});
</script>
