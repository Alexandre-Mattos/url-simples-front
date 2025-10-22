<template>
  <v-app-bar
    elevation="0"
    class="app-header"
    height="64"
    :class="{ 'header-dark': isDarkMode }"
  >
    <v-container fluid class="d-flex align-center justify-space-between px-6">
      <NuxtLink :to="authenticated ? '/dashboard' : '/'" class="logo-link">
        <div class="logo-container">
          <div class="logo-icon">
            <v-icon size="28" color="white">mdi-link-variant</v-icon>
          </div>
          <div class="logo-text">
            <h1 class="logo-title">Curtinho</h1>
            <p class="logo-subtitle">.com</p>
          </div>
        </div>
      </NuxtLink>

      <div class="header-actions">
        <template v-if="authenticated">
          <v-btn
            variant="text"
            class="nav-btn"
            size="small"
            to="/dashboard"
          >
            <v-icon left size="18">mdi-view-dashboard</v-icon>
            Dashboard
          </v-btn>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="text"
                v-bind="props"
                class="user-btn"
              >
                <v-icon>mdi-account-circle</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item to="/profile">
                <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-title>Perfil</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$emit('logout')">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Sair</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-btn
            variant="text"
            class="login-btn"
            size="small"
            to="/login"
          >
            Login
          </v-btn>
          <v-btn
            class="register-btn"
            size="small"
            elevation="0"
            to="/register"
          >
            Registrar-se
          </v-btn>
        </template>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
import { eventBus } from '~/utils/eventBus'

export default {
  name: 'AppBar',
  props: {
    authenticated: {
      type: Boolean,
      default: false
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
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.3), 0 0 20px rgba(236, 72, 153, 0.2);
  transition: all 0.3s ease;
}

.logo-container:hover .logo-icon {
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(236, 72, 153, 0.3);
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

.logo-link {
  text-decoration: none;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav-btn {
  color: #e5e7eb;
  text-transform: none;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
}

.user-btn {
  color: #e5e7eb;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
}

.login-btn {
  color: #e5e7eb;
  text-transform: none;
  font-weight: 600;
  border-radius: 10px;
  padding: 0 20px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
}

.register-btn {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  color: white;
  text-transform: none;
  font-weight: 600;
  border-radius: 10px;
  padding: 0 24px;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5), 0 0 30px rgba(236, 72, 153, 0.3);
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

  .header-actions {
    gap: 8px;
  }

  .nav-btn {
    padding: 0 12px;
    font-size: 0.875rem;
  }

  .login-btn {
    padding: 0 12px;
    font-size: 0.875rem;
  }

  .register-btn {
    padding: 0 16px;
    font-size: 0.875rem;
  }
}
</style>
