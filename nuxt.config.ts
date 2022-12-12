
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {
        content: ['app.vue', 'components/**/*', 'layouts/**/*', 'pages/**/*'],
        theme: {
          extend: {
            colors: {
              current: 'currentColor',
              favorite: 'var(--color-favorite)',
              negative: 'rgb(var(--color-ui-negative-rgb) / <alpha-value>)',
              positive: 'rgb(var(--color-ui-positive-rgb) / <alpha-value>)',
              primary: {
                DEFAULT: 'rgb(var(--color-ui-primary-rgb) / <alpha-value>)',
                100: 'rgb(var(--color-ui-primary-100-rgb) / <alpha-value>)',
                200: 'rgb(var(--color-ui-primary-200-rgb) / <alpha-value>)',
                300: 'rgb(var(--color-ui-primary-300-rgb) / <alpha-value>)',
                400: 'rgb(var(--color-ui-primary-400-rgb) / <alpha-value>)',
                500: 'rgb(var(--color-ui-primary-500-rgb) / <alpha-value>)',
                600: 'rgb(var(--color-ui-primary-600-rgb) / <alpha-value>)',
                700: 'rgb(var(--color-ui-primary-700-rgb) / <alpha-value>)',
                800: 'rgb(var(--color-ui-primary-800-rgb) / <alpha-value>)',
                900: 'rgb(var(--color-ui-primary-900-rgb) / <alpha-value>)'
              },
              transparent: 'transparent'
            }
          }
        },
        plugins: [
          require('@tailwindcss/container-queries'),
          require('@tailwindcss/forms')
        ]
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
