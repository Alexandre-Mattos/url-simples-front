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
  </v-app-bar>
</template>

<script>
import logoImage from '~/assets/curtinho_w_icon_without_border.png'
import { eventBus } from '~/utils/eventBus'
import axios from 'axios'  

export default {
  name: 'AppBar',
  data() {
    return {
      logoSrc: logoImage,
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
  methods: {
    openStats() {
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