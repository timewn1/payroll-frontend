export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Payroll',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '/css/all.min.css' },
      { rel: 'stylesheet', type: 'text/css', href: '/css/sb-admin-2.min.css' },
      { rel: 'stylesheet', type: 'text/css', href: '/css/styles.css' },
      { rel: 'stylesheet', type: 'text/css', href: '/css/cus-calender.css' },
    ],
    script: [
      {
        src: '/js/jquery.min.js',
        body: true,
      },
      {
        src: '/js/bootstrap.bundle.min.js',
        body: true,
      },
      {
        src: '/js/sb-admin-2.min.js',
        body: true,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/toasted.js' },
    { src: '~/plugins/litepicker.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    //  nuxt composition-api
    '@nuxtjs/composition-api/module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    //  dot env
    '@nuxtjs/dotenv',
    'vue-toastification/nuxt',
  ],

  // vue-sweetalert2
  sweetalert: {
    confirmButtonColor: '#41b882',
    cancelButtonColor: '#ff7674',
  },

  // vue-toastification
  toast: {
    timeout: 1500,
    closeOnClick: false,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    credentials: true,
  },

  // auth
  auth: {
    strategies: {
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: process.env.API_URL,
        endpoints: {
          login: {
            url: '/api/login',
          },
          user: {
            url: '/api/user',
          },
          logout: {
            url: '/api/logout',
          },
        },
        user: {
          property: false,
        },
      },
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/dashboard',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
