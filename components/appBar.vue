<template>
  <v-app-bar
    elevation="0"
    class="app-header"
    height="64"
    :class="{ 'header-dark': isDarkMode }"
  >
    <v-container class="d-flex align-center">
      <div class="logo">
        curtinho.com
      </div>

      <v-spacer></v-spacer>

      <v-btn
        icon
        variant="text"
        @click="toggleTheme"
        class="theme-toggle"
        size="small"
      >
        <v-icon size="20">{{ isDarkMode ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      </v-btn>
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
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.header-dark {
  background: rgba(0, 0, 0, 0.8) !important;
  border-bottom: 1px solid #333;
}

.logo {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}

.header-dark .logo {
  color: #fff;
}

.theme-toggle {
  color: #666;
}

.theme-toggle:hover {
  color: #000;
}

.header-dark .theme-toggle {
  color: #999;
}

.header-dark .theme-toggle:hover {
  color: #fff;
}
</style>