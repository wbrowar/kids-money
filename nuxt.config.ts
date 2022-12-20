import * as tailwindConfig from './tailwind.config.cjs'

export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: tailwindConfig
    }
  },
  runtimeConfig: {
    public: {
      enableAdminRoute: false,
      fun: true,
      useMockApiData: false
    }
  }
})
