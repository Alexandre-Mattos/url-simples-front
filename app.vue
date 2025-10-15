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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.v-application {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif !important;
}

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>