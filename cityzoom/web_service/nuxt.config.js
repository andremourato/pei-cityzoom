const pkg = require('./package')


module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,

  /*
  ** Global CSS
  */
  css: [
    { src: '~/assets/global.scss', lang: 'scss' },
    { src: '~/assets/charts.scss', lang: 'scss' },
    { src: '~/assets/animations.scss', lang: 'scss' },
    { src: '~/assets/tables.scss', lang: 'scss' },
    { src: '~/node_modules/dc/style/dc.scss', lang: 'scss' },
    { src: '~/node_modules/ol/ol.css', lang: 'css' },
  ],
  
  router: {
    middleware: ['auth']
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/core-components.js',
    {src: "~/plugins/vue-grid.js", ssr: false},
    {src: "~/plugins/core-functions.js", ssr: false},
    {src: "~/plugins/no-ssr-components.js", ssr: false},
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    debug:true
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  }
}
