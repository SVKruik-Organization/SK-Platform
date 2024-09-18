// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
      public: {
          docsApiBase: process.env.DOCS_API_BASE
      }
  },

  modules: ['@pinia/nuxt']
});