// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  $production: {
    routeRules: {
      "/**": { isr: true },
    },
  },
  modules: ['@pinia/nuxt',
       ['@nuxtjs/google-fonts', {
        families: {
          Roboto: true,
          Inter: [400, 700],
          'Josefin+Sans': true,
          Lato: [100, 300],
          Raleway: {
            wght: [100, 400],
            ital: [100]
          },
          Oswald: [400, 700],
          'Roboto+Slab': [400, 500, 700],
         
       
        }
    }],
],
  css: [
    '@/assets/css/main.css',
    "vuetify/styles", 
    "@mdi/font/css/materialdesignicons.min.css", 
   
  
],
  plugins: ["~/plugins/vuetify.ts" , 
    '~/plugins/axios.js',
    '~/plugins/vue3-toastify.ts'
  ],
  components: true,
  build: {
    transpile: ["vuetify",],
  },
});
