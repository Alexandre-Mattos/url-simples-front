<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script setup>
import { useHead } from "#imports";

useHead({
  script: this.$config.app.head.script
});
</script>
