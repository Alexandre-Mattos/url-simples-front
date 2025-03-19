<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig();

useHead({
  script: [
    {
      hid: "adsbygoogle",
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.ADSENSE_CLIENT_ID}crossorigin=anonymous`,
      async: true,
    },
  ],
});
</script>