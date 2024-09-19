export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            authApiBase: process.env.AUTH_API_BASE,
            docsApiBase: process.env.DOCS_API_BASE
        }
    },
    modules: ['@pinia/nuxt'],
    ssr: true,
    app: {
        head: {
            title: 'SK Platform',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            script: [
                { src: 'https://kit.fontawesome.com/ffc90f94bc.js', crossorigin: 'anonymous' }
            ]
        }
    },
    routeRules: {
        '/documentation/read': { redirect: '/documentation' }
    }
});