<template>
  <v-app-bar
    elevation="0"
    class="app-header"
    height="64"
    :class="{ 'header-dark': isDarkMode }"
  >
    <v-container fluid class="d-flex align-center justify-space-between px-6">
      <div class="logo-container">
        <div class="logo-icon">
          <v-icon size="28" color="white">mdi-link-variant</v-icon>
        </div>
        <div class="logo-text">
          <h1 class="logo-title">Curtinho</h1>
          <p class="logo-subtitle">.com</p>
        </div>
      </div>

      <div class="header-actions">
        <v-btn
          icon
          variant="text"
          @click="toggleTheme"
          class="theme-toggle"
          size="small"
        >
          <v-icon size="20">{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
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
  background: rgba(0, 0, 0, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-dark {
  background: rgba(0, 0, 0, 0.98) !important;
  border-bottom: 1px solid rgba(168, 85, 247, 0.3);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-container:hover {
  transform: translateY(-1px);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.3);
  transition: all 0.3s ease;
}

.logo-container:hover .logo-icon {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(236, 72, 153, 0.5);
  transform: scale(1.05);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  margin-top: 2px;
  font-weight: 500;
}

.header-dark .logo-subtitle {
  color: #9ca3af;
}

.theme-toggle {
  border-radius: 10px;
  transition: all 0.3s ease;
  color: #9ca3af;
}

.theme-toggle:hover {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  transform: rotate(20deg);
}

@media (max-width: 768px) {
  .logo-title {
    font-size: 18px;
  }

  .logo-subtitle {
    font-size: 10px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
  }
}
</style>
