import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'

import { useUserStore } from '@/stores/userStore';

library.add(fas)
const app = createApp(App).component('fa', FontAwesomeIcon)

app.use(createPinia())

const userStore = useUserStore();
await userStore.initAuth();

app.use(router)

app.mount('#app')
