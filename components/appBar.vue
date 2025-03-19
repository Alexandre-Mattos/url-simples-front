<template>
  <v-app-bar elevation="1" class="gradient-background">
    <div class="d-flex align-center">
      <v-img
        alt="Curtinho Logo"
        class="shrink mr-2 ml-15"
        contain
        :src="logoSrc"
        transition="scale-transition"
        aspect-ratio="16/9"
        width="250"
      />
    </div>
    <v-spacer></v-spacer>
    
    <v-btn icon @click="toggleTheme" class="on-primary">
      <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
    </v-btn>
    
    <v-btn icon class="on-primary" @click="openStats">
      <v-icon>mdi-chart-bar</v-icon>
    </v-btn>
    
    <v-dialog v-model="showStats" max-width="500">
      <v-card>
        <v-card-title class="headline">Estatísticas</v-card-title>
        <v-card-text>
          <p>Links gerados hoje: {{ todayLinks }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showStats = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import logoImage from '~/assets/curtinho_w_icon_without_border.png'
import { eventBus } from '~/utils/eventBus'
import axios from 'axios'  // Make sure to import axios

export default {
  name: 'AppBar',
  data() {
    return {
      logoSrc: logoImage,
      showStats: false,
      todayLinks: 0    
    }
  },
  computed: {
    isDarkMode() {
      return eventBus.isDarkMode
    }
  },
  mounted() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    eventBus.setDarkMode(savedDarkMode)
    this.applyTheme()
  },
  watch: {
    showStats(newValue) {
      if (newValue === true) {
        this.fetchLinksToday()
      }
    }
  },
  methods: {
    openStats() {
      this.showStats = true
      this.fetchLinksToday()
    },
    async fetchLinksToday() {
      try {
        const response = await axios.post(
          `${this.$config.app.backendUrl}/count-links-today`,
        )
        
        this.todayLinks = response.data.count
      } catch (err) {
        console.log(err)
        this.showSnackbar('Erro ao buscar estatísticas. Tente novamente.', 'error')
      }
    },
    toggleTheme() {
      eventBus.setDarkMode(!eventBus.isDarkMode)
      localStorage.setItem('darkMode', eventBus.isDarkMode)
      this.applyTheme()
    },
    applyTheme() {
      this.$vuetify.theme.global.name = eventBus.isDarkMode ? 'darkTheme' : 'lightTheme'
    },
    showSnackbar(message, color) {
      console.error(message)
    }
  }
}
</script>

<style scoped>
.gradient-background {
  background: black!important;
}
</style>