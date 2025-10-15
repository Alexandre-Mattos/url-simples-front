<template>
  <div class="url-shortener">
    <!-- Hero Section -->
    <div class="hero-section">
      <h1 class="hero-title">Encurte seus links</h1>
      <p class="hero-subtitle">Simples, rápido e gratuito</p>
    </div>

    <!-- URL Shortener Form -->
    <div class="shortener-section">
      <v-form @submit.prevent="submit" ref="form">
        <div class="input-group">
          <v-text-field
            v-model="originalUrl"
            :rules="urlRules"
            placeholder="cole sua URL aqui"
            variant="solo"
            flat
            class="url-input"
            hide-details="auto"
            density="comfortable"
            @keyup.enter="submit"
          />

          <v-btn
            type="submit"
            :loading="loading"
            :disabled="!isValidUrl"
            class="shorten-btn"
            size="x-large"
            elevation="0"
          >
            Encurtar
          </v-btn>
        </div>
      </v-form>


      <!-- Results -->
      <div v-if="newUrls.length > 0" class="results-section">
        <div
          v-for="(url, index) in newUrls"
          :key="index"
          class="result-item"
        >
          <a :href="url" target="_blank" class="short-url">{{ url }}</a>

          <div class="result-actions">
            <v-btn
              variant="text"
              size="small"
              @click="copy(url, index)"
              class="action-btn"
            >
              <v-icon size="18">
                {{ copiedIndex === index ? 'mdi-check' : 'mdi-content-copy' }}
              </v-icon>
            </v-btn>

            <v-btn
              variant="text"
              size="small"
              @click="removeUrl(index)"
              class="action-btn"
            >
              <v-icon size="18">mdi-close</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="bottom"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
import { eventBus } from '~/utils/eventBus'

export default {
  name: 'GenerateUrl',
  data() {
    return {
      originalUrl: '',
      newUrls: [],
      loading: false,
      copiedIndex: null,
      todayLinks: this.getRandomLinkCount(),
      showValidation: false,
      snackbar: {
        show: false,
        text: '',
        color: 'success',
        timeout: 3000
      }
    }
  },
  
  computed: {
    urlRules() {
      return [
        v => {
          if (!this.showValidation) return true
          return !!v || 'URL é obrigatória'
        },
        v => {
          if (!this.showValidation || !v) return true
          try {
            new URL(v)
            return true
          } catch (e) {
            return 'URL inválida. Inclua http:// ou https://'
          }
        }
      ]
    },
    isValidUrl() {
      if (!this.originalUrl) return false
      try {
        new URL(this.originalUrl)
        return true
      } catch (e) {
        return false
      }
    },
    isDarkMode() {
      return eventBus.isDarkMode
    }
  },
  
  mounted() {
    const savedUrls = localStorage.getItem('curtinho_history')
    if (savedUrls) {
      try {
        this.newUrls = JSON.parse(savedUrls)
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }
    
    this.fetchLinksToday()
  },

  methods: {
    getRandomLinkCount() {
      return Math.floor(Math.random() * 1001) + 500
    },

    formatNumber(num) {
      return new Intl.NumberFormat('pt-BR').format(num)
    },

    async fetchLinksToday() {
      try {
        const response = await axios.get(
          `${this.$config.app.backendUrl}/count-links-today`,
        )
        this.todayLinks += response.data.count
      } catch (err) {
        console.log('Erro ao buscar estatísticas:', err)
      }
    },

    async submit() {
      this.showValidation = true
      if (!this.$refs.form.validate()) return
      
      this.loading = true

      try {
        const response = await axios.post(
          `${this.$config.app.backendUrl}/encurtar`,
          {
            url: this.originalUrl,
          },
        )
        
        this.loading = false
        this.originalUrl = ''
        this.newUrls.unshift(response.data)
        
        localStorage.setItem('curtinho_history', JSON.stringify(this.newUrls))
        
        this.showSnackbar('Link encurtado com sucesso! 🎉', 'success')
        
      } catch (err) {
        console.log(err)
        this.loading = false
        this.showSnackbar('Erro ao encurtar o link. Tente novamente.', 'error')
      }
    },

    removeUrl(index) {
      this.newUrls.splice(index, 1)
      localStorage.setItem('curtinho_history', JSON.stringify(this.newUrls))
      this.showSnackbar('Link removido', 'info')
    },

    copy(value, index) {
      navigator.clipboard.writeText(value)
        .then(() => {
          this.copiedIndex = index
          this.showSnackbar('Link copiado! 📋', 'success')
          setTimeout(() => {
            this.copiedIndex = null
          }, 2000)
        })
        .catch(err => {
          console.error('Erro ao copiar:', err)
          this.showSnackbar('Erro ao copiar o link', 'error')
        })
    },
    
    openUrl(url) {
      window.open(url, '_blank')
    },
    
    clearAll() {
      this.newUrls = []
      localStorage.setItem('curtinho_history', JSON.stringify(this.newUrls))
      this.showSnackbar('Todos os links foram removidos', 'info')
    },
    
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.show = true
    }
  }
}
</script>

<style scoped>
.url-shortener {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 80px 0 64px;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 12px;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0;
  font-weight: 400;
}

/* Shortener Section */
.shortener-section {
  margin-bottom: 40px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}

.url-input :deep(.v-field) {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.url-input :deep(.v-field__input) {
  padding: 20px;
  font-size: 1rem;
}

.url-input :deep(input::placeholder) {
  color: #999;
  font-weight: 400;
}

.shorten-btn {
  background: #000;
  color: white;
  border-radius: 8px;
  padding: 0 32px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  height: 56px;
}

.shorten-btn:hover {
  background: #333;
}

/* Results Section */
.results-section {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.result-item:hover {
  background: #f0f0f0;
}

.short-url {
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  color: #333;
  text-decoration: none;
  flex: 1;
}

.short-url:hover {
  color: #000;
}

.result-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  color: #666;
  min-width: 36px;
}

.action-btn:hover {
  color: #000;
}

/* Dark Mode */
.v-theme--darkTheme .hero-title,
.v-theme--darkTheme .hero-subtitle {
  color: #fff;
}

.v-theme--darkTheme .url-input :deep(.v-field) {
  background: #1a1a1a;
  border-color: #333;
}

.v-theme--darkTheme .url-input :deep(input) {
  color: #fff;
}

.v-theme--darkTheme .shorten-btn {
  background: #fff;
  color: #000;
}

.v-theme--darkTheme .shorten-btn:hover {
  background: #e0e0e0;
}

.v-theme--darkTheme .result-item {
  background: #1a1a1a;
}

.v-theme--darkTheme .result-item:hover {
  background: #222;
}

.v-theme--darkTheme .short-url {
  color: #fff;
}

.v-theme--darkTheme .action-btn {
  color: #999;
}

.v-theme--darkTheme .action-btn:hover {
  color: #fff;
}

/* Responsive */
@media (max-width: 768px) {
  .url-shortener {
    padding: 0 20px;
  }

  .hero-section {
    padding: 60px 0 48px;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .result-actions {
    align-self: flex-end;
  }
}
</style>