<template>
  <v-app-bar
    elevation="0"
    class="app-header"
    height="80"
    :class="{ 'header-dark': isDarkMode }"
  >
    <v-container class="d-flex align-center px-6">
      <div class="d-flex align-center">
        <div class="logo-container">
          <div class="logo-icon">
            <v-icon size="32" color="primary">mdi-link-variant</v-icon>
          </div>
          <div class="logo-text">
            <h1 class="logo-title">Curtinho</h1>
            <p class="logo-subtitle">.com</p>
          </div>
        </div>
      </div>

      <v-spacer></v-spacer>

      <div class="header-actions">
        <v-btn
          icon
          variant="text"
          @click="toggleTheme"
          class="theme-toggle"
          size="large"
        >
          <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
import { eventBus } from '~/utils/eventBus'

export default {
  name: 'AppBar',
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
    toggleTheme() {
      eventBus.setDarkMode(!eventBus.isDarkMode)
      localStorage.setItem('darkMode', eventBus.isDarkMode)
      this.applyTheme()
    },
    applyTheme() {
      this.$vuetify.theme.global.name = eventBus.isDarkMode ? 'darkTheme' : 'lightTheme'
    }
  }
}
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.header-dark {
  background: rgba(18, 18, 18, 0.95) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
  margin-top: -2px;
}

.theme-toggle {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  .logo-title {
    font-size: 20px;
  }

  .logo-subtitle {
    font-size: 12px;
  }
}
</style>
