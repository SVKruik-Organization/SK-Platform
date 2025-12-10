export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },
    ssr: true,
    css: [
        "./app/assets/css/base.css",
        "./app/assets/css/interaction.css",
        "./app/assets/css/documentation.css",
        "./app/assets/css/docpage.css",
    ],
    modules: [
        "@pinia/nuxt",
        "@nuxt/image",
        "pinia-plugin-persistedstate/nuxt"
    ],
    piniaPluginPersistedstate: {
        storage: "sessionStorage",
        auto: true,
    },
    pinia: {
        storesDirs: ["./app/stores/**"],
    },
    runtimeConfig: {
        authApiBase: "",
        authApiKey: "",
        docsApiBase: "",
        docsApiKey: "",

        uplinkHost: "",
        uplinkPort: "",
        uplinkUsername: "",
        uplinkPassword: "",
        uplinkExchange: "",
        uplinkRouter: "",
    },
    app: {
        head: {
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: "keywords", content: `SK Platform Documentation, SK Documentation, SK Docs, SK Docs Home, Stefan Kruik, stefankruik, Bots, SK Bots, Docs` },
                { name: "author", content: "Stefan Kruik, platform@stefankruik.com" },
                { name: "owner", content: "Stefan Kruik" },
                { property: "og:site_name", content: "SK Platform" },
                { property: "og:locale", content: "en_US" },
                { property: "og:locale:alternate", content: "nl_NL" },
                { property: "og:determiner", content: "the" },
                { property: "og:image:type", content: "image/png" },
                { property: "og:image:width", content: "1280" },
                { property: "og:image:height", content: "640" },
                { property: "twitter:card", content: "summary_large_image" },
            ],
            link: [
                { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/css/flag-icons.min.css' }
            ]
        }
    },
    router: {
        options: {
            scrollBehaviorType: 'smooth'
        }
    },
    routeRules: {
        '/documentation/read': { redirect: '/documentation' },
        '/documentation/read/*': { redirect: '/documentation' }
    }
});