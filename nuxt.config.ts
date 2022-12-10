// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {
        content: ['app.vue', 'components/**/*', 'layouts/**/*', 'pages/**/*'],
        theme: {
          extend: {
            current: 'currentColor',
            transparent: 'transparent'
          }
        },
        plugins: []
      }
    }
  },
  runtimeConfig: {
    public: {
      enableAdminRoute: false,
      useMockApiData: false
    }
  }
})
