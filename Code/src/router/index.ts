import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "active",
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: "/:pathMatch(.*)", redirect: "/" }
    ]
})

export default router;
