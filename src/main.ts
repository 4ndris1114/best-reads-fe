import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import activityHub from '@/utils/activityHub';

import App from './App.vue'
import router from './router'

import { useUserStore } from '@/stores/userStore';
import { useActivityStore } from './stores/activityStore'
import { useToastStore } from './stores/toastStore'
import type { IActivity } from './types/interfaces/IActivity'
import { mapToIActivity } from './utils/mappers'
import { updateUnreadCount } from './utils/notifications'

library.add(fas)
const app = createApp(App).component('fa', FontAwesomeIcon)

// Start the SignalR connection
activityHub.start()
  .then(() => {
    console.log('SignalR connected!');
  })
  .catch((err) => {
    console.error('SignalR connection failed:', err);
  });

app.use(createPinia())

const userStore = useUserStore();
const activityStore = useActivityStore();
const toastStore = useToastStore();
await userStore.initAuth();

app.use(router)

activityHub.off('ReceiveActivity'); // remove all previous for safety

activityHub.on('ReceiveActivity', async (activity: IActivity) => {
  if (activity.userId === sessionStorage.getItem('loggedInUserId')) return;

  const activities = JSON.parse(sessionStorage.getItem('activities') || '[]');
  activities.unshift(activity);
  sessionStorage.setItem('activities', JSON.stringify(activities));
  sessionStorage.setItem('unreadCount', String(Number(sessionStorage.getItem('unreadCount')) + 1));
  updateUnreadCount();

  toastStore.triggerToast('New activity on your feed!', 'success');
  activityStore.activities.unshift(mapToIActivity(activity));
});


app.mount('#app')
