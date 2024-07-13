import { fetchBase } from '@/utils/fetch';
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from "@/stores/UserStore";

// Views - Misc
const NotFoundView = () => import('@/views/misc/NotFoundView.vue');
const UnauthorizedView = () => import('@/views/misc/UnauthorizedView.vue');

// Views - General
const AccountView = () => import('@/views/AccountView.vue');
const DeveloperView = () => import('@/views/DeveloperView.vue');
const DocumentationView = () => import('@/views/DocumentationView.vue');
const LandingView = () => import('@/views/LandingView.vue');
const LoginView = () => import('@/views/LoginView.vue');
const PlansView = () => import('@/views/PlansView.vue');
const ProductView = () => import('@/views/ProductView.vue');
const TemporaryView = () => import('@/views/TemporaryView.vue');

// Pages
const DocumentationHomePage = () => import('@/pages/Documentation/HomePage.vue');
const DocumentationNotFound = () => import('@/pages/Documentation/NotFoundPage.vue');
const DocumentationReadPage = () => import('@/pages/Documentation/ReadPage.vue');
const TemporaryPage = () => import('@/pages/TemporaryPage.vue');

// Tabs (sub-pages)
const TemporaryTab = () => import('@/tabs/TemporaryTab.vue');

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "active-router-link",
    linkExactActiveClass: "active-exact-router-link",
    routes: [
        { path: "/login", component: LoginView, props: true },
        { path: "/", component: LandingView, props: true },
        { path: "/product", component: ProductView, props: true },
        { path: "/plans", component: PlansView, props: true },
        { path: "/developer", component: DeveloperView, props: true },
        {
            path: "/documentation", component: DocumentationView, props: true, children: [
                { path: "", component: DocumentationHomePage, props: true },
                { path: "edit", component: TemporaryPage, props: true },
                { path: "read/:type/:category/:page?", component: DocumentationReadPage, props: true },
                { path: "notfound", component: DocumentationNotFound, props: true },
                { path: ":pathMatch(.*)", redirect: "/documentation" },
            ]
        },
        {
            path: "/account", component: AccountView, props: true, beforeEnter: [authValidation], children: [
                { path: "", component: TemporaryPage, props: true },
                { path: "billing", component: TemporaryPage, props: true },
                { path: "settings", component: TemporaryPage, props: true },
                { path: ":pathMatch(.*)", redirect: "/account" },
            ]
        },
        { path: "/unauthorized", component: UnauthorizedView, props: true },
        { path: "/:pathMatch(.*)", component: NotFoundView }
    ]
});

// Authorization Check
async function authValidation() {
    // Initial Validation
    const userStore = useUserStore();

    // Token Presence
    const token = userStore.user.token;
    if (!token) return "/unauthorized";

    // Token Validation
    const access: boolean = await fetchBase(token);
    if (!access) return "/unauthorized";
}

export default router;
