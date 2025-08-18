<template>
  <div class="url-shortener">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Encurte seus links em
          <span class="gradient-text">segundos</span>
        </h1>
        <p class="hero-subtitle">
          Transforme URLs longas em links curtos, elegantes e fáceis de compartilhar
        </p>
      </div>
    </div>

    <!-- Stats Card -->
    <div class="stats-section">
      <div class="stats-card">
        <div class="stats-content">
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(todayLinks) }}</div>
            <div class="stat-label">Links criados hoje</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">∞</div>
            <div class="stat-label">Cliques rastreados</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Gratuito</div>
          </div>
        </div>
      </div>
    </div>

    <!-- URL Shortener Form -->
    <div class="shortener-section">
      <div class="shortener-card">
        <div class="form-container">
          <v-form @submit.prevent="submit" ref="form">
            <div class="input-group">
              <div class="input-container">
                <v-text-field
                  v-model="originalUrl"
                  :rules="urlRules"
                  placeholder="Cole seu link aqui... https://exemplo.com/link-muito-longo"
                  variant="outlined"
                  class="url-input"
                  hide-details="auto"
                  @keyup.enter="submit"
                >
                  <template v-slot:prepend-inner>
                    <v-icon color="primary" size="20">mdi-link-variant</v-icon>
                  </template>
                </v-text-field>
              </div>
              
              <v-btn
                type="submit"
                :loading="loading"
                :disabled="!isValidUrl"
                class="shorten-btn"
                size="large"
                elevation="0"
              >
                <v-icon left size="20">mdi-content-cut</v-icon>
                Encurtar
              </v-btn>
            </div>
          </v-form>
        </div>

        <!-- Results -->
        <div v-if="newUrls.length > 0" class="results-section">
          <div class="results-header">
            <h3>Seus links encurtados</h3>
            <v-btn 
              v-if="newUrls.length > 1"
              variant="text" 
              size="small" 
              @click="clearAll"
              class="clear-btn"
            >
              <v-icon left size="16">mdi-delete-sweep</v-icon>
              Limpar todos
            </v-btn>
          </div>

          <div class="results-list">
            <div 
              v-for="(url, index) in newUrls" 
              :key="index" 
              class="result-item"
            >
              <div class="result-content">
                <div class="result-url">
                  <v-icon color="success" size="16" class="mr-2">mdi-check-circle</v-icon>
                  <span class="short-url">{{ url }}</span>
                </div>
                
                <div class="result-actions">
                  <v-btn
                    variant="outlined"
                    size="small"
                    @click="copy(url, index)"
                    :color="copiedIndex === index ? 'success' : 'primary'"
                    class="action-btn"
                  >
                    <v-icon left size="16">
                      {{ copiedIndex === index ? 'mdi-check' : 'mdi-content-copy' }}
                    </v-icon>
                    {{ copiedIndex === index ? 'Copiado!' : 'Copiar' }}
                  </v-btn>
                  
                  <v-btn
                    variant="outlined"
                    size="small"
                    @click="openUrl(url)"
                    color="primary"
                    class="action-btn"
                  >
                    <v-icon size="16">mdi-open-in-new</v-icon>
                  </v-btn>
                  
                  <v-btn
                    variant="text"
                    size="small"
                    @click="removeUrl(index)"
                    color="error"
                    class="action-btn"
                  >
                    <v-icon size="16">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <v-icon size="24" color="primary">mdi-flash</v-icon>
          </div>
          <h4>Rápido</h4>
          <p>Encurte URLs instantaneamente sem cadastro</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <v-icon size="24" color="primary">mdi-shield-check</v-icon>
          </div>
          <h4>Seguro</h4>
          <p>Links seguros e confiáveis para compartilhar</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">
            <v-icon size="24" color="primary">mdi-chart-line</v-icon>
          </div>
          <h4>Rastreável</h4>
          <p>Acompanhe cliques e estatísticas dos seus links</p>
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
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 60px 0 40px;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Stats Section */
.stats-section {
  margin-bottom: 40px;
}

.stats-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.stats-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(102, 126, 234, 0.2);
  margin: 0 20px;
}

/* Shortener Section */
.shortener-section {
  margin-bottom: 60px;
}

.shortener-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.input-group {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.input-container {
  flex: 1;
}

.url-input :deep(.v-field) {
  border-radius: 16px;
  font-size: 1rem;
}

.url-input :deep(.v-field__input) {
  padding: 16px 20px;
  min-height: 56px;
}

.shorten-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 0 32px;
  height: 56px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.shorten-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Results Section */
.results-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #eee;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.clear-btn {
  color: #666;
  text-transform: none;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.result-item:hover {
  background: #f0f2f5;
  transform: translateY(-2px);
}

.result-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.result-url {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.short-url {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.95rem;
  color: #333;
  word-break: break-all;
}

.result-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  text-transform: none;
  border-radius: 12px;
}

/* Features Section */
.features-section {
  margin-bottom: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.feature-card h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.feature-card p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

/* Dark Mode */
.v-theme--darkTheme .hero-title {
  color: #fff;
}

.v-theme--darkTheme .shortener-card {
  background: #1e1e1e;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--darkTheme .result-item {
  background: #2a2a2a;
}

.v-theme--darkTheme .result-item:hover {
  background: #333;
}

.v-theme--darkTheme .feature-card {
  background: #1e1e1e;
  border-color: rgba(255, 255, 255, 0.1);
}

.v-theme--darkTheme .short-url {
  color: #fff;
}

/* Responsive */
@media (max-width: 768px) {
  .url-shortener {
    padding: 0 16px;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .shorten-btn {
    width: 100%;
  }
  
  .result-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .result-actions {
    justify-content: center;
  }
  
  .stats-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .stat-divider {
    width: 40px;
    height: 1px;
    margin: 0;
  }
  
  .shortener-card {
    padding: 24px;
  }
}
</style>