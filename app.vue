<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script setup>
import { useHead, useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();

useHead({
  script: [
    {
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      async: true,
      "data-ad-client": config.app.adsenseClient, 
    },
  ],
});
</script>