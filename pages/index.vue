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
  min-height: calc(100vh - 64px);
  background: #ffffff;
  padding-top: 0;
}

.footer {
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
  color: #666;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: center;
  padding: 48px 0 24px;
  text-align: center;
}

.footer-brand {
  max-width: 500px;
}

.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.footer-title {
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
}

.footer-description {
  color: #999;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

.footer-links {
  display: none;
}

.link-group h4 {
  display: none;
}

.footer-link {
  display: none;
}

.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid #e0e0e0;
}

.copyright {
  color: #999;
  margin: 0;
  font-size: 0.85rem;
}

.social-links {
  display: none;
}

.social-btn {
  display: none;
}

/* Dark Mode */
.v-theme--darkTheme .main-content {
  background: #000;
}

.v-theme--darkTheme .footer {
  background: #0a0a0a;
  border-top: 1px solid #222;
}

.v-theme--darkTheme .footer-title {
  color: #fff;
}

.v-theme--darkTheme .footer-bottom {
  border-top: 1px solid #222;
}

</style>