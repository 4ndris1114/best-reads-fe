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

// You can also listen for incoming events here (optional)
activityHub.on('ReceiveActivity', async (activity: IActivity) => {
    const userStore = useUserStore();
    const activityStore = useActivityStore();    
    const toastStore = useToastStore();

    if (activity.userId === userStore.loggedInUser?.id) return;

    if (localStorage.getItem('activities') === null) {
      localStorage.setItem('activities', JSON.stringify([]));
    }
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.unshift(activity);
    localStorage.setItem('activities', JSON.stringify(activities));

    toastStore.triggerToast('New activity on your feed!', 'success');
    activityStore.activities.unshift(mapToIActivity(activity));
});

app.use(createPinia())

const userStore = useUserStore();
await userStore.initAuth();

app.use(router)

app.mount('#app')
