import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          hid: "adsbygoogle",
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_CLIENT_ID}`,
          async: true,
          crossorigin: "anonymous",
        },
      ],
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  runtimeConfig: {
    app: {
      backendUrl: process.env.BACKEND_URL,
      adsenseClient: process.env.ADSENSE_CLIENT_ID,
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
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
