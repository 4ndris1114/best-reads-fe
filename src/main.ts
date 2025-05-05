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
activityHub.on('ReceiveActivity', (activity: IActivity) => {
    const activityStore = useActivityStore();    
    activityStore.activities.unshift(mapToIActivity(activity));
});

app.use(createPinia())

const userStore = useUserStore();
await userStore.initAuth();

app.use(router)

app.mount('#app')
