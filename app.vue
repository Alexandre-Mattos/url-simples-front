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
  script: config.app.head.script,
});
</script>