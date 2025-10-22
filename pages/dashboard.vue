<template>
  <v-app>
    <AppBar :authenticated="true" @logout="handleLogout" />
    <v-main class="main-content">
      <v-container>
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">Meus Links</h1>
            <p class="dashboard-subtitle">Gerencie todos os seus links encurtados</p>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <v-icon color="primary" size="32">mdi-link-variant</v-icon>
            <div class="stat-content">
              <div class="stat-number">{{ totalLinks }}</div>
              <div class="stat-label">Links Criados</div>
            </div>
          </div>
          <div class="stat-card">
            <v-icon color="success" size="32">mdi-cursor-default-click</v-icon>
            <div class="stat-content">
              <div class="stat-number">{{ totalClicks }}</div>
              <div class="stat-label">Total de Cliques</div>
            </div>
          </div>
        </div>

        <!-- Quick Shorten Section -->
        <v-card class="quick-shorten-card" elevation="0">
          <v-card-text class="pa-6">
            <h3 class="quick-shorten-title mb-4">
              <v-icon left color="primary">mdi-lightning-bolt</v-icon>
              Encurtar Link Rápido
            </h3>
            <div class="quick-shorten-form">
              <div class="quick-inputs-wrapper">
                <v-text-field
                  v-model="quickUrl"
                  label="Cole seu link aqui..."
                  placeholder="https://exemplo.com/link-muito-longo"
                  variant="outlined"
                  prepend-inner-icon="mdi-link"
                  :error-messages="quickUrlError"
                  @keyup.enter="quickShortenUrl"
                  hide-details="auto"
                  class="quick-url-input"
                ></v-text-field>
                <v-text-field
                  v-model="quickCustomCode"
                  label="Código personalizado (opcional)"
                  placeholder="meu-link"
                  variant="outlined"
                  prepend-inner-icon="mdi-pencil"
                  :error-messages="quickCodeError"
                  @keyup.enter="quickShortenUrl"
                  hide-details="auto"
                  class="quick-custom-input"
                ></v-text-field>
              </div>
              <v-btn
                color="primary"
                size="large"
                class="quick-shorten-btn"
                :loading="quickLoading"
                :disabled="!quickUrl"
                @click="quickShortenUrl"
              >
                <v-icon left>mdi-scissors-cutting</v-icon>
                Encurtar
              </v-btn>
            </div>
            
            <!-- Quick Result -->
            <v-expand-transition>
              <div v-if="quickResult" class="quick-result mt-4">
                <div class="result-header">
                  <v-icon color="success" size="20">mdi-check-circle</v-icon>
                  <span>Link encurtado com sucesso!</span>
                </div>
                <div class="result-content">
                  <a :href="quickResult" target="_blank" class="result-url">
                    {{ quickResult }}
                  </a>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="copyLink(quickResult)"
                    class="copy-quick-btn"
                  >
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-expand-transition>
          </v-card-text>
        </v-card>

        <!-- Links List -->
        <div class="links-section">
          <v-card class="links-card" elevation="0">
            <v-card-title class="d-flex align-center justify-space-between">
              <span>Seus Links</span>
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Buscar links..."
                variant="outlined"
                density="compact"
                hide-details
                class="search-field"
              ></v-text-field>
            </v-card-title>

            <v-card-text>
              <div v-if="loading" class="text-center py-8">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>

              <div v-else-if="filteredLinks.length === 0" class="empty-state">
                <v-icon size="64" color="grey">mdi-link-off</v-icon>
                <h3>Nenhum link encontrado</h3>
                <p>Comece criando seu primeiro link encurtado</p>
              </div>

              <div v-else class="links-list">
                <div
                  v-for="link in filteredLinks"
                  :key="link.id"
                  class="link-item"
                >
                  <div class="link-info">
                    <div class="link-urls">
                      <a :href="link.shortUrl" target="_blank" class="short-url">
                        {{ link.shortUrl }}
                        <v-icon size="14">mdi-open-in-new</v-icon>
                      </a>
                      <div class="original-url">{{ link.originalUrl }}</div>
                    </div>
                    <div class="link-meta">
                      <v-chip size="small" color="success" variant="tonal">
                        <v-icon left size="16">mdi-cursor-default-click</v-icon>
                        {{ link.clicks }} cliques
                      </v-chip>
                      <span class="link-date">{{ formatDate(link.createdAt) }}</span>
                    </div>
                  </div>

                  <div class="link-actions">
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      @click="copyLink(link.shortUrl)"
                    >
                      <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                    <!-- Botão de estatísticas desabilitado temporariamente -->
                    <!-- <v-btn
                      icon
                      variant="text"
                      size="small"
                      @click="viewStats(link)"
                    >
                      <v-icon>mdi-chart-line</v-icon>
                    </v-btn> -->
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="error"
                      @click="confirmDelete(link)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-main>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja deletar este link? Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDeleteDialog = false">Cancelar</v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="deleteLink"
          >
            Deletar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar desabilitado temporariamente -->
    <!-- <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top"
    >
      {{ snackbar.text }}
    </v-snackbar> -->
  </v-app>
</template>

<script>
import AppBar from '@/components/appBar.vue'
import axios from 'axios'

export default {
  name: 'DashboardPage',
  components: {
    AppBar,
  },
  data() {
    return {
      links: [],
      search: '',
      loading: true,
      deleting: false,
      showDeleteDialog: false,
      linkToDelete: null,
      quickUrl: '',
      quickCustomCode: '',
      quickUrlError: '',
      quickCodeError: '',
      quickLoading: false,
      quickResult: null,
      snackbar: {
        show: false,
        text: '',
        color: 'success',
        timeout: 3000
      }
    }
  },
  computed: {
    filteredLinks() {
      if (!this.search) return this.links
      
      const searchLower = this.search.toLowerCase()
      return this.links.filter(link => 
        link.shortUrl.toLowerCase().includes(searchLower) ||
        link.originalUrl.toLowerCase().includes(searchLower)
      )
    },
    totalLinks() {
      return this.links.length
    },
    totalClicks() {
      return this.links.reduce((sum, link) => sum + (link.clicks || 0), 0)
    }
  },
  mounted() {
    this.checkAuth()
    this.fetchLinks()
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('authToken')
      if (!token) {
        this.$router.push('/login')
      }
    },

    async fetchLinks() {
      this.loading = true
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(
          `${this.$config.public.backendUrl}/auth/user/links`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        this.links = response.data.links || []
      } catch (err) {
        console.error('Erro ao buscar links:', err)
        if (err.response?.status === 401 || err.response?.status === 403) {
          this.showSnackbar('Sessão expirada. Faça login novamente.', 'error')
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
        }
      } finally {
        this.loading = false
      }
    },

    async quickShortenUrl() {
      // Validar URL
      if (!this.quickUrl) {
        this.quickUrlError = 'Por favor, insira uma URL'
        return
      }

      try {
        new URL(this.quickUrl)
      } catch {
        this.quickUrlError = 'Por favor, insira uma URL válida'
        return
      }

      this.quickUrlError = ''
      this.quickCodeError = ''
      this.quickLoading = true
      this.quickResult = null

      try {
        const token = localStorage.getItem('authToken')
        const payload = {
          url: this.quickUrl
        }
        
        // Adicionar código customizado se fornecido
        if (this.quickCustomCode) {
          payload.customCode = this.quickCustomCode
        }

        const response = await axios.post(
          `${this.$config.public.backendUrl}/auth/encurtar`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        this.quickResult = response.data.shortUrl
        this.showSnackbar('Link encurtado com sucesso! 🎉', 'success')
        
        // Limpar os campos e atualizar a lista
        this.quickUrl = ''
        this.quickCustomCode = ''
        this.fetchLinks()

      } catch (err) {
        console.error('Erro ao encurtar link:', err)
        const errorMsg = err.response?.data?.message || 'Erro ao encurtar link'
        
        // Se o erro for relacionado ao código customizado
        if (errorMsg.toLowerCase().includes('código') || errorMsg.toLowerCase().includes('code')) {
          this.quickCodeError = errorMsg
        } else {
          this.quickUrlError = errorMsg
        }
      } finally {
        this.quickLoading = false
      }
    },

    confirmDelete(link) {
      this.linkToDelete = link
      this.showDeleteDialog = true
    },

    async deleteLink() {
      if (!this.linkToDelete) return

      this.deleting = true
      try {
        const token = localStorage.getItem('authToken')
        await axios.delete(
          `${this.$config.public.backendUrl}/auth/user/links/${this.linkToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        this.showSnackbar('Link deletado com sucesso', 'success')
        this.showDeleteDialog = false
        this.linkToDelete = null
        this.fetchLinks()

      } catch (err) {
        console.error('Erro ao deletar link:', err)
        this.showSnackbar('Erro ao deletar link', 'error')
      } finally {
        this.deleting = false
      }
    },

    copyLink(url) {
      navigator.clipboard.writeText(url)
        .then(() => {
          this.showSnackbar('Link copiado! 📋', 'success')
        })
        .catch(err => {
          console.error('Erro ao copiar:', err)
          this.showSnackbar('Erro ao copiar o link', 'error')
        })
    },

    viewStats(link) {
      // Implementar visualização de estatísticas
      this.showSnackbar('Estatísticas em desenvolvimento', 'info')
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },

    handleLogout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      this.$router.push('/')
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
.main-content {
  min-height: calc(100vh - 64px);
  background: #000000;
  background-image:
    radial-gradient(ellipse at top, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
  padding: 104px 0 40px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.dashboard-subtitle {
  color: #9ca3af;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(10px);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: #9ca3af;
  font-size: 0.875rem;
}

.quick-shorten-card {
  background: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin-bottom: 32px;
}

.quick-shorten-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
}

.quick-shorten-form {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.quick-inputs-wrapper {
  flex: 1;
  display: flex;
  gap: 16px;
  flex-direction: column;
}

.quick-url-input {
  flex: 1;
}

.quick-custom-input {
  flex: 1;
}

/* Remove outline/borda feia dos inputs */
.quick-url-input :deep(.v-field--focused) {
  box-shadow: none !important;
}

.quick-custom-input :deep(.v-field--focused) {
  box-shadow: none !important;
}

.quick-url-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.quick-custom-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.quick-url-input :deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
  --v-field-border-opacity: 0.6;
}

.quick-custom-input :deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
  --v-field-border-opacity: 0.6;
}

.quick-shorten-btn {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  text-transform: none;
  font-weight: 600;
  min-width: 140px;
  height: 56px;
}

.quick-result {
  padding: 16px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #22c55e;
  font-weight: 600;
  margin-bottom: 8px;
}

.result-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.result-url {
  flex: 1;
  color: #a855f7;
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
}

.result-url:hover {
  text-decoration: underline;
}

.copy-quick-btn {
  color: #9ca3af;
}

.copy-quick-btn:hover {
  color: #ffffff;
}

.links-section {
  margin-top: 32px;
}

.links-card {
  background: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.3);
  backdrop-filter: blur(10px);
}

/* Remove outline/box-shadow de todos os inputs */
.links-card :deep(.v-field--focused) {
  box-shadow: none !important;
}

.links-card :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.links-card :deep(.v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
  --v-field-border-opacity: 0.6;
}

.search-field {
  max-width: 300px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state h3 {
  margin: 16px 0 8px;
  color: #ffffff;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.link-item {
  background: rgba(20, 20, 20, 0.5);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.link-item:hover {
  border-color: rgba(168, 85, 247, 0.4);
  background: rgba(20, 20, 20, 0.7);
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-urls {
  margin-bottom: 12px;
}

.short-url {
  color: #a855f7;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s ease;
}

.short-url:hover {
  color: #ec4899;
}

.original-url {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.link-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.link-actions {
  display: flex;
  gap: 4px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 84px 0 40px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .quick-shorten-form {
    flex-direction: column;
  }

  .quick-shorten-btn {
    width: 100%;
  }

  .search-field {
    max-width: 100%;
  }

  .link-item {
    flex-direction: column;
    align-items: stretch;
  }

  .link-actions {
    justify-content: flex-end;
  }
}
</style>
