<template>
  <v-app>
    <AppBar :authenticated="true" @logout="handleLogout" />
    <v-main class="main-content">
      <v-container class="profile-container">
        <div class="profile-header">
          <h1 class="profile-title">Meu Perfil</h1>
          <p class="profile-subtitle">Gerencie suas informações pessoais</p>
        </div>

        <!-- Card de Informações do Perfil -->
        <v-card class="profile-card">
          <v-card-text class="pa-6">
            <div class="profile-avatar-section">
              <v-avatar size="100" class="profile-avatar">
                <v-icon size="60">mdi-account-circle</v-icon>
              </v-avatar>
              <div class="profile-info">
                <h2 class="profile-name">{{ user.name }}</h2>
                <p class="profile-email">{{ user.email }}</p>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <v-form @submit.prevent="handleUpdateProfile" ref="form" validate-on="submit">
              <h3 class="form-section-title">Informações Pessoais</h3>
              
              <v-text-field
                v-model="formData.name"
                :rules="nameRules"
                label="Nome completo"
                variant="outlined"
                class="mb-4"
                prepend-inner-icon="mdi-account"
                validate-on="submit"
              ></v-text-field>

              <v-text-field
                v-model="formData.email"
                :rules="emailRules"
                label="E-mail"
                type="email"
                variant="outlined"
                class="mb-4"
                prepend-inner-icon="mdi-email"
                validate-on="submit"
                disabled
                hint="O e-mail não pode ser alterado"
                persistent-hint
              ></v-text-field>

              <v-divider class="my-6"></v-divider>

              <h3 class="form-section-title">Alterar Senha</h3>
              <p class="form-section-subtitle">Deixe em branco se não quiser alterar</p>

              <v-text-field
                v-model="formData.currentPassword"
                label="Senha atual"
                :type="showCurrentPassword ? 'text' : 'password'"
                variant="outlined"
                class="mb-4"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showCurrentPassword = !showCurrentPassword"
              ></v-text-field>

              <v-text-field
                v-model="formData.newPassword"
                :rules="newPasswordRules"
                label="Nova senha"
                :type="showNewPassword ? 'text' : 'password'"
                variant="outlined"
                class="mb-4"
                prepend-inner-icon="mdi-lock-plus"
                :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showNewPassword = !showNewPassword"
                validate-on="submit"
              ></v-text-field>

              <v-text-field
                v-model="formData.confirmPassword"
                :rules="confirmPasswordRules"
                label="Confirmar nova senha"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="outlined"
                class="mb-6"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                validate-on="submit"
              ></v-text-field>

              <div class="profile-actions">
                <v-btn
                  type="submit"
                  :loading="loading"
                  class="save-btn"
                  size="large"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  Salvar Alterações
                </v-btn>

                <v-btn
                  variant="outlined"
                  class="cancel-btn"
                  size="large"
                  @click="resetForm"
                >
                  Cancelar
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Card de Estatísticas -->
        <v-card class="stats-card mt-6">
          <v-card-text class="pa-6">
            <h3 class="form-section-title mb-4">Estatísticas da Conta</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <v-icon color="purple" size="32">mdi-link-variant</v-icon>
                <div>
                  <div class="stat-number">{{ userStats.totalLinks }}</div>
                  <div class="stat-label">Links Criados</div>
                </div>
              </div>
              <div class="stat-item">
                <v-icon color="pink" size="32">mdi-cursor-default-click</v-icon>
                <div>
                  <div class="stat-number">{{ userStats.totalClicks }}</div>
                  <div class="stat-label">Total de Cliques</div>
                </div>
              </div>
              <div class="stat-item">
                <v-icon color="purple" size="32">mdi-calendar</v-icon>
                <div>
                  <div class="stat-number">{{ userStats.memberSince }}</div>
                  <div class="stat-label">Membro desde</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Card de Zona de Perigo -->
        <v-card class="danger-card mt-6">
          <v-card-text class="pa-6">
            <h3 class="danger-title">Zona de Perigo</h3>
            <p class="danger-subtitle">Ações irreversíveis para sua conta</p>
            
            <v-btn
              color="error"
              variant="outlined"
              @click="deleteDialog = true"
              class="mt-4"
            >
              <v-icon left>mdi-delete-forever</v-icon>
              Excluir Conta
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Dialog de Confirmação de Exclusão -->
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card class="delete-dialog-card">
          <v-card-title class="delete-dialog-title">
            <v-icon color="error" size="48">mdi-alert-circle</v-icon>
            <span>Excluir Conta</span>
          </v-card-title>
          <v-card-text class="delete-dialog-text">
            <p>Esta ação é <strong>irreversível</strong>. Todos os seus links e dados serão permanentemente excluídos.</p>
            <p class="mt-4">Digite seu e-mail para confirmar:</p>
            <v-text-field
              v-model="deleteConfirmEmail"
              label="Confirmar e-mail"
              variant="outlined"
              class="mt-4"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="deleteDialog = false">Cancelar</v-btn>
            <v-btn
              color="error"
              :disabled="deleteConfirmEmail !== user.email"
              :loading="deletingAccount"
              @click="handleDeleteAccount"
            >
              Excluir Permanentemente
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar desabilitado temporariamente -->
      <!-- <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      >
        {{ snackbar.text }}
      </v-snackbar> -->
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import AppBar from '~/components/appBar.vue'

export default {
  name: 'ProfilePage',
  components: {
    AppBar,
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
      },
      formData: {
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      userStats: {
        totalLinks: 0,
        totalClicks: 0,
        memberSince: '',
      },
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      loading: false,
      deletingAccount: false,
      deleteDialog: false,
      deleteConfirmEmail: '',
      snackbar: {
        show: false,
        text: '',
        color: 'success',
        timeout: 3000
      },
      nameRules: [
        v => !!v || 'Nome é obrigatório',
        v => v.length >= 3 || 'Nome deve ter no mínimo 3 caracteres',
      ],
      emailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
      ],
      newPasswordRules: [
        v => {
          if (!v) return true // Senha é opcional
          return v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres'
        },
      ],
      confirmPasswordRules: [
        v => {
          if (!this.formData.newPassword) return true
          return v === this.formData.newPassword || 'As senhas não coincidem'
        },
      ],
    }
  },
  mounted() {
    this.checkAuth()
    this.loadUserData()
    this.loadUserStats()
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('authToken')
      if (!token) {
        this.$router.push('/login')
      }
    },

    async loadUserData() {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          this.user = JSON.parse(userStr)
          this.formData.name = this.user.name
          this.formData.email = this.user.email
        }

        // Buscar dados atualizados do servidor
        const token = localStorage.getItem('authToken')
        const response = await axios.get(
          `${this.$config.public.backendUrl}/auth/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.data.user) {
          this.user = response.data.user
          this.formData.name = this.user.name
          this.formData.email = this.user.email
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err)
      }
    },

    async loadUserStats() {
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

        const links = response.data.links || []
        this.userStats.totalLinks = links.length
        this.userStats.totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)

        // Calcular tempo de membro (se disponível)
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const userData = JSON.parse(userStr)
          if (userData.createdAt) {
            const date = new Date(userData.createdAt)
            this.userStats.memberSince = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
          } else {
            this.userStats.memberSince = 'Out 2025'
          }
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err)
      }
    },

    async handleUpdateProfile() {
      if (!this.$refs.form.validate()) return

      this.loading = true

      try {
        const token = localStorage.getItem('authToken')
        const updateData = {
          name: this.formData.name,
        }

        // Se está alterando senha, incluir no payload
        if (this.formData.newPassword) {
          if (!this.formData.currentPassword) {
            this.showSnackbar('Informe sua senha atual para alterar a senha', 'error')
            this.loading = false
            return
          }
          updateData.currentPassword = this.formData.currentPassword
          updateData.newPassword = this.formData.newPassword
        }

        const response = await axios.put(
          `${this.$config.public.backendUrl}/auth/user/profile`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        // Atualizar dados locais
        this.user.name = this.formData.name
        localStorage.setItem('user', JSON.stringify(this.user))

        // Limpar campos de senha
        this.formData.currentPassword = ''
        this.formData.newPassword = ''
        this.formData.confirmPassword = ''

        this.showSnackbar('Perfil atualizado com sucesso! 🎉', 'success')
      } catch (err) {
        console.error('Erro ao atualizar perfil:', err)
        this.showSnackbar(
          err.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.',
          'error'
        )
      } finally {
        this.loading = false
      }
    },

    async handleDeleteAccount() {
      if (this.deleteConfirmEmail !== this.user.email) {
        this.showSnackbar('E-mail de confirmação não corresponde', 'error')
        return
      }

      this.deletingAccount = true

      try {
        const token = localStorage.getItem('authToken')
        await axios.delete(
          `${this.$config.public.backendUrl}/auth/user/account`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        this.showSnackbar('Conta excluída com sucesso', 'success')

        // Limpar dados e redirecionar
        setTimeout(() => {
          localStorage.clear()
          this.$router.push('/')
        }, 1500)
      } catch (err) {
        console.error('Erro ao excluir conta:', err)
        this.showSnackbar(
          err.response?.data?.message || 'Erro ao excluir conta. Tente novamente.',
          'error'
        )
      } finally {
        this.deletingAccount = false
        this.deleteDialog = false
      }
    },

    resetForm() {
      this.formData.name = this.user.name
      this.formData.currentPassword = ''
      this.formData.newPassword = ''
      this.formData.confirmPassword = ''
      this.$refs.form?.resetValidation()
    },

    handleLogout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('uid')
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

.profile-container {
  max-width: 900px;
}

.profile-header {
  margin-bottom: 32px;
}

.profile-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.profile-subtitle {
  color: #9ca3af;
  margin: 0;
}

.profile-card,
.stats-card,
.danger-card {
  background: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.profile-email {
  color: #9ca3af;
  margin: 4px 0 0;
}

.form-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
}

.form-section-subtitle {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: -8px 0 16px;
}

.profile-actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.save-btn {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  color: white;
  text-transform: none;
  font-weight: 600;
}

.cancel-btn {
  border-color: rgba(168, 85, 247, 0.5);
  color: #a855f7;
  text-transform: none;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(168, 85, 247, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.stat-label {
  color: #9ca3af;
  font-size: 0.9rem;
}

.danger-card {
  border-color: rgba(239, 68, 68, 0.3);
}

.danger-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 8px;
}

.danger-subtitle {
  color: #9ca3af;
  margin: 0;
}

.delete-dialog-card {
  background: rgba(10, 10, 10, 0.95);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.delete-dialog-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #ffffff;
  font-size: 1.5rem;
  padding: 24px;
}

.delete-dialog-text {
  color: #d1d5db;
  padding: 0 24px 24px;
}

.delete-dialog-text strong {
  color: #ef4444;
}

@media (max-width: 768px) {
  .main-content {
    padding: 84px 0 40px;
  }

  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .profile-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
