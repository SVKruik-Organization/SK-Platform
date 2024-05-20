import { createRouter, createWebHistory } from 'vue-router';

// Views
const NotFoundView = () => import('@/views/misc/NotFoundView.vue');
const UnauthorizedView = () => import('@/views/misc/UnauthorizedView.vue');
const AccountView = () => import('@/views/AccountView.vue');
const HomeView = () => import('@/views/HomeView.vue');
const LoginView = () => import('@/views/LoginView.vue');
const TemporaryView = () => import('@/views/TemporaryView.vue');

// Pages
const DeveloperPage = () => import('@/pages/home/DeveloperPage.vue');
const DocumentationPage = () => import('@/pages/home/DocumentationPage.vue');
const LandingPage = () => import('@/pages/home/LandingPage.vue');
const ProductPage = () => import('@/pages/home/ProductPage.vue');
const PricingPage = () => import('@/pages/home/PricingPage.vue');
const TemporaryPage = () => import('@/pages/TemporaryPage.vue');

// Tabs (sub-pages)
const TemporaryTab = () => import('@/tabs/TemporaryTab.vue');

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "active-router-link",
    linkExactActiveClass: "active-exact-router-link",
    routes: [
        { path: "/login", component: LoginView, props: true },
        { path: "/", redirect: "/home/landing" },
        {
            path: "/home", component: HomeView, props: true, children: [
                { path: "", redirect: "/home/landing" },
                { path: "landing", component: LandingPage, props: true },
                { path: "product", component: ProductPage, props: true },
                { path: "pricing", component: PricingPage, props: true },
                { path: "documentation", component: DocumentationPage, props: true },
                { path: "developer", component: DeveloperPage, props: true },
                { path: ":pathMatch(.*)", redirect: "/home/landing" },
            ]
        },
        {
            path: "/account", component: AccountView, props: true, children: [
                { path: "", redirect: "/account/overview" },
                { path: "overview", component: TemporaryPage, props: true },
                { path: "billing", component: TemporaryPage, props: true },
                { path: "settings", component: TemporaryPage, props: true },
                { path: ":pathMatch(.*)", redirect: "/account/overview" },
            ]
        },
        { path: "/unauthorized", component: UnauthorizedView, props: true },
        { path: "/:pathMatch(.*)", component: NotFoundView }
    ]
});

export default router;
