<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container class="content">
        <v-row class="d-flex flex-column">
          <v-col>
            <GenerateUrl />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    
    <v-footer app padless>
      <v-card flat tile width="100%" class="text-center">
        <v-card-text>
          <v-btn
            v-for="icon in socialIcons"
            :key="icon.icon"
            class="mx-2"
            icon
            color="primary"
          >
            <v-icon>{{ icon.icon }}</v-icon>
          </v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="text-caption">
          {{ new Date().getFullYear() }} — <strong>Curtinho</strong> | Encurtador de URLs simples e rápido
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import AppBar from '@/components/appBar.vue'
import GenerateUrl from '@/components/generateUrl.vue'

export default {
  name: 'IndexPage',
  components: {
    AppBar,
    GenerateUrl
  },
  data() {
    return {
      socialIcons: [
        { icon: 'mdi-facebook' },
        { icon: 'mdi-twitter' },
        { icon: 'mdi-instagram' },
        { icon: 'mdi-linkedin' }
      ]
    }
  }
}
</script>

<style scoped>
.content {
  width: 100%;
  padding-bottom: 80px; /* Espaço para o footer */
}
</style>