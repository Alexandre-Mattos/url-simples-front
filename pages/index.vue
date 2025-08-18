<template>
  <v-app>
    <AppBar />
    <v-main class="main-content">
      <GenerateUrl />
    </v-main>
    
    <v-footer class="footer" padless>
      <v-container>
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <v-icon size="24" color="primary">mdi-link-variant</v-icon>
              <span class="footer-title">Curtinho</span>
            </div>
            <p class="footer-description">
              O encurtador de URLs mais simples e rápido do Brasil
            </p>
          </div>
          
          <div class="footer-links">
            <div class="link-group">
              <h4>Produto</h4>
              <a href="#" class="footer-link">Como funciona</a>
              <a href="#" class="footer-link">API</a>
              <a href="#" class="footer-link">Estatísticas</a>
            </div>
            
            <div class="link-group">
              <h4>Suporte</h4>
              <a href="#" class="footer-link">Central de Ajuda</a>
              <a href="#" class="footer-link">Contato</a>
              <a href="#" class="footer-link">Status</a>
            </div>
            
            <div class="link-group">
              <h4>Legal</h4>
              <a href="#" class="footer-link">Privacidade</a>
              <a href="#" class="footer-link">Termos</a>
              <a href="#" class="footer-link">Cookies</a>
            </div>
          </div>
        </div>
        
        <v-divider class="my-4"></v-divider>
        
        <div class="footer-bottom">
          <p class="copyright">
            © {{ new Date().getFullYear() }} Curtinho.com - Todos os direitos reservados
          </p>
          <div class="social-links">
            <v-btn
              v-for="social in socialLinks"
              :key="social.icon"
              :href="social.url"
              target="_blank"
              icon
              variant="text"
              size="small"
              class="social-btn"
            >
              <v-icon size="20">{{ social.icon }}</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import AppBar from '@/components/appBar.vue'
import GenerateUrl from '@/components/generateUrl.vue'

export default {
  name: 'IndexPage',
  components: {
    AppBar,
    GenerateUrl,
  },
  data() {
    return {
      socialLinks: [
        { icon: 'mdi-twitter', url: 'https://twitter.com' },
        { icon: 'mdi-instagram', url: 'https://instagram.com' },
        { icon: 'mdi-linkedin', url: 'https://linkedin.com' },
        { icon: 'mdi-github', url: 'https://github.com' }
      ]
    }
  }
}
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-top: 0;
}

.footer {
  background: #1a1a1a;
  color: white;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 48px;
  padding: 48px 0 24px;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  color: #ccc;
  line-height: 1.6;
  margin: 0;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.link-group h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: white;
}

.footer-link {
  display: block;
  color: #ccc;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #667eea;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
}

.copyright {
  color: #999;
  margin: 0;
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  gap: 8px;
}

.social-btn {
  color: #ccc;
  transition: all 0.3s ease;
}

.social-btn:hover {
  color: #667eea;
  transform: translateY(-2px);
}

/* Dark Mode */
.v-theme--darkTheme .main-content {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>