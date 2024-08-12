import './assets/base.css';
import './assets/interaction.css';
import './assets/docpage.css';
import { createApp, markRaw } from 'vue';
import type { Router } from 'vue-router';
import { createPinia, type Pinia } from 'pinia'
import App from './App.vue';
import router from './router';

declare module 'pinia' {
    export interface PiniaCustomProperties {
        $router: Router;
    }
}

// Use Router in Pinia
const pinia: Pinia = createPinia();
pinia.use(({ store }) => {
    store.$router = markRaw(router);
});

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app');
