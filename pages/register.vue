<template>
  <v-app>
    <AppBar />
    <v-main class="main-content">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1 class="auth-title">Criar sua conta</h1>
            <p class="auth-subtitle">Comece a gerenciar seus links agora</p>
          </div>

          <v-form @submit.prevent="handleRegister" ref="form" validate-on="submit">
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Nome completo"
              variant="outlined"
              class="mb-4"
              prepend-inner-icon="mdi-account"
              validate-on="submit"
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              type="email"
              variant="outlined"
              class="mb-4"
              prepend-inner-icon="mdi-email"
              validate-on="submit"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Senha"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              class="mb-4"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              validate-on="submit"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              label="Confirmar senha"
              :type="showConfirmPassword ? 'text' : 'password'"
              variant="outlined"
              class="mb-4"
              prepend-inner-icon="mdi-lock-check"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              validate-on="submit"
            ></v-text-field>

            <v-btn
              type="submit"
              :loading="loading"
              :disabled="!isFormValid"
              class="register-btn"
              size="large"
              block
            >
              Criar conta
            </v-btn>
          </v-form>

          <div class="auth-footer">
            <p>
              Já tem uma conta?
              <NuxtLink to="/login" class="auth-link">Entrar</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </v-main>

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
  name: 'RegisterPage',
  components: {
    AppBar,
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      acceptTerms: false,
      loading: false,
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
      passwordRules: [
        v => !!v || 'Senha é obrigatória',
        v => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres',
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirmação de senha é obrigatória',
        v => v === this.password || 'As senhas não coincidem',
      ],
    }
  },
  computed: {
    isFormValid() {
      return this.name && 
             this.email && 
             this.password && 
             this.confirmPassword &&
             this.password === this.confirmPassword &&
             this.password.length >= 6 &&
             /.+@.+\..+/.test(this.email)
    }
  },
  methods: {
    async handleRegister() {
      if (!this.$refs.form.validate()) return

      this.loading = true

      try {
        const response = await axios.post(
          `${this.$config.public.backendUrl}/auth/register`,
          {
            name: this.name,
            email: this.email,
            password: this.password,
          }
        )

        // Armazenar o token e informações do usuário
        localStorage.setItem('authToken', response.data.authToken || response.data.customToken)
        localStorage.setItem('uid', response.data.uid)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        this.showSnackbar('Conta criada com sucesso! 🎉', 'success')

        // Redirecionar para dashboard
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 1500)

      } catch (err) {
        console.error('Erro ao criar conta:', err)
        this.showSnackbar(
          err.response?.data?.message || 'Erro ao criar conta. Tente novamente.',
          'error'
        )
      } finally {
        this.loading = false
      }
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 40px;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: rgba(10, 10, 10, 0.6);
  border-radius: 24px;
  padding: 48px 40px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.1), 0 0 50px rgba(236, 72, 153, 0.05);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.auth-subtitle {
  color: #9ca3af;
  font-size: 0.95rem;
  margin: 0;
}

.terms-link {
  color: #a855f7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #ec4899;
}

.register-btn {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  color: white;
  text-transform: none;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 8px;
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.25);
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(168, 85, 247, 0.2);
}

.auth-footer p {
  color: #9ca3af;
  font-size: 0.95rem;
  margin: 0;
}

.auth-link {
  color: #a855f7;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #ec4899;
}

@media (max-width: 768px) {
  .main-content {
    padding: 100px 20px 40px;
  }

  .auth-card {
    padding: 32px 24px;
  }

  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
