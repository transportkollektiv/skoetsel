const API_URL = process.env.API_URL || 'http://localhost:8000';

export default {
  env: {
    API_URL: API_URL
  },

  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'skoetsel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org
    '@nuxtjs/auth',
    'nuxt-leaflet',
  ],

  router: {
    middleware: ['auth'],
  },

  bootstrapVue: {
    icons: true
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: API_URL,
    credentials: true
  },

  auth: {
    cookie: false,
    fullPathRedirect: true,
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/auth/token',
            method: 'post',
            propertyName: 'token',
          },
          logout: false,
          user: {
            url: '/api/user',
            method: 'get',
            propertyName: 'username',
          },
        },
        tokenName: 'Authorization',
        tokenType: 'Token',
        // future:
        token: {
          type: 'Token',
          name: 'Authorization',
        },
      },
      redirect: {
        login: '/login',
        home: '/',
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
