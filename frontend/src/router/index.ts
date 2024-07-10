import { fetchBase } from '@/utils/fetch';
import { createRouter, createWebHistory, type RouteLocation } from 'vue-router';
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
const PricingView = () => import('@/views/PricingView.vue');
const ProductView = () => import('@/views/ProductView.vue');
const TemporaryView = () => import('@/views/TemporaryView.vue');

// Pages
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
        { path: "/pricing", component: PricingView, props: true },
        { path: "/developer", component: DeveloperView, props: true },
        { path: "/documentation", component: DocumentationView, props: true }, {
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

// Authorization Check
router.beforeEach(async (to: RouteLocation, from: RouteLocation) => {
    // Initial Validation
    const userStore = useUserStore();
    console.log(userStore.user);
    if (!to.fullPath.includes("/account")) return;

    // Token Presence
    const token = userStore.user.token;
    if (!token) return "/login";

    // Token Validation
    const access: boolean = await fetchBase(token);
    if (!access) return "/login";
});

export default router;
