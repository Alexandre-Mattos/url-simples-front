import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  app: {
    head: {},
  },
  build: {
    transpile: ["vuetify"],
  },
  runtimeConfig: {
    app: {
      backendUrl: process.env.BACKEND_URL,
      adsenseClient: process.env.ADSENSE_CLIENT_ID,
    },
    public: {
      adsenseClient: process.env.ADSENSE_CLIENT_ID,
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        if (!config.plugins) config.plugins = [];
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
