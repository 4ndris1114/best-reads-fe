import { ref } from "vue";

export const unreadCount = ref(Number(sessionStorage.getItem('unreadCount')) || 0);

export const updateUnreadCount = () => {
    unreadCount.value = Number(sessionStorage.getItem('unreadCount')) || 0;
}