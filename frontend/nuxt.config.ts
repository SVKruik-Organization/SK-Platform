export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            authApiBase: process.env.AUTH_API_BASE,
            docsApiBase: process.env.DOCS_API_BASE
        },
        uplink_host: process.env.AMQP_HOST,
        uplink_port: process.env.AMQP_PORT,
        uplink_username: process.env.AMQP_USERNAME,
        uplink_password: process.env.AMQP_PASSWORD
    },
    modules: ['@pinia/nuxt'],
    ssr: true,
    app: {
        head: {
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: "keywords", content: `SK Platform Documentation, SK Documentation, SK Docs, SK Docs Home, Stefan Kruik, stefankruik, Bots, SK Bots, Docs` },
                { name: "author", content: "Stefan Kruik, platform@stefankruik.com" },
                { name: "owner", content: "Stefan Kruik" },
                { name: "color-scheme", content: "dark" },
                { name: "theme-color", content: "#1E1F24" },
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
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ],
            script: [
                { src: 'https://kit.fontawesome.com/ffc90f94bc.js', crossorigin: 'anonymous' }
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