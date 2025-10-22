import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-10-21",
  app: {
    head: {},
  },
  build: {
    transpile: ["vuetify"],
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL || "http://localhost:3001",
      adsenseClient: process.env.ADSENSE_CLIENT_ID,
    },
  },
  devtools: {
    enabled: false,
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
    optimizeDeps: {
      include: ["axios"],
    },
  },
  nitro: {
    compressPublicAssets: true,
  },
});
