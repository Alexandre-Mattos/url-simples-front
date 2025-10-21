<template>
  <div class="url-shortener">
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
        this.showValidation = false
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

.hero-section {
  text-align: center;
  padding: 60px 0 40px;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  color: #ffffff;
  text-align: center;
}

.gradient-text {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(168, 85, 247, 0.5);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #9ca3af;
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 400;
  text-align: center;
}

.stats-section {
  margin-bottom: 40px;
}

.stats-card {
  background: rgba(10, 10, 10, 0.5);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 20px;
  padding: 32px 24px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.1);
}

.stats-card:hover {
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 60px rgba(168, 85, 247, 0.2), 0 0 80px rgba(236, 72, 153, 0.1);
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
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));
}

.stat-label {
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 50px;
  background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.5), transparent);
  margin: 0 20px;
}

.shortener-section {
  margin-bottom: 60px;
}

.shortener-card {
  background: rgba(10, 10, 10, 0.6);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 0 60px rgba(168, 85, 247, 0.15), 0 0 100px rgba(236, 72, 153, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.shortener-card:hover {
  box-shadow: 0 0 80px rgba(168, 85, 247, 0.25), 0 0 120px rgba(236, 72, 153, 0.15);
  border-color: rgba(168, 85, 247, 0.5);
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
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  color: white;
  border-radius: 16px;
  padding: 0 40px;
  height: 56px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.4);
}

.shorten-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 50px rgba(168, 85, 247, 0.6), 0 0 80px rgba(236, 72, 153, 0.4);
}

.shorten-btn:active {
  transform: translateY(-1px);
}

.results-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(168, 85, 247, 0.2);
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
  color: #ffffff;
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
  background: rgba(20, 20, 20, 0.5);
  border-radius: 16px;
  padding: 20px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.result-item:hover {
  background: rgba(20, 20, 20, 0.7);
  transform: translateY(-2px);
  border-color: rgba(168, 85, 247, 0.4);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
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
  color: #e5e7eb;
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
  background: rgba(10, 10, 10, 0.5);
  border-radius: 20px;
  border: 1px solid rgba(168, 85, 247, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.2);
  border-color: rgba(168, 85, 247, 0.4);
}

.feature-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.3s ease;
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
}

.feature-card:hover .feature-icon {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%);
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.4);
}

.feature-card h4 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #ffffff;
}

.feature-card p {
  color: #9ca3af;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.v-theme--darkTheme .hero-title {
  color: #fff;
}

.v-theme--darkTheme .shortener-card {
  background: rgba(10, 10, 10, 0.8);
  border-color: rgba(168, 85, 247, 0.4);
}

.v-theme--darkTheme .result-item {
  background: rgba(20, 20, 20, 0.7);
}

.v-theme--darkTheme .result-item:hover {
  background: rgba(20, 20, 20, 0.9);
}

.v-theme--darkTheme .feature-card {
  background: rgba(10, 10, 10, 0.7);
  border-color: rgba(168, 85, 247, 0.3);
}

.v-theme--darkTheme .short-url {
  color: #e5e7eb;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .shortener-card {
    padding: 32px 24px;
  }
}

@media (max-width: 768px) {
  .url-shortener {
    padding: 0 16px;
  }

  .hero-section {
    padding: 40px 0 30px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
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
    justify-content: stretch;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 100px;
  }

  .stats-content {
    flex-direction: column;
    gap: 20px;
  }

  .stat-divider {
    width: 60%;
    height: 1px;
    margin: 0 auto;
  }

  .shortener-card {
    padding: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .shortener-card {
    padding: 20px;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
