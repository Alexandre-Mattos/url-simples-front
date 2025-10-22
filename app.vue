<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

.v-application {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.v-btn:focus-visible {
  outline: none !important;
}

/* Remove outline/box-shadow feio de todos os inputs Vuetify */
.v-field--focused {
  box-shadow: none !important;
}

.v-field__outline {
  --v-field-border-opacity: 0.3;
}

.v-field--focused .v-field__outline {
  --v-field-border-width: 2px;
  --v-field-border-opacity: 0.6;
}

/* Remove outline de text fields */
.v-text-field input:focus {
  outline: none !important;
}

.v-textarea textarea:focus {
  outline: none !important;
}
</style>