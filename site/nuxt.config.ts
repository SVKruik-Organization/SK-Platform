export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },
    ssr: true,
    app: {
        head: {
            htmlAttrs: { lang: 'en' },
            title: 'SK Horizon',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            script: [
                { src: 'https://kit.fontawesome.com/ffc90f94bc.js', crossorigin: 'anonymous' }
            ]
        }
    }
});