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
        </div>
        
        <v-divider class="my-4"></v-divider>
        
        <div class="footer-bottom">
          <p class="copyright">
            © {{ new Date().getFullYear() }} Curtinho.com - Todos os direitos reservados
          </p>
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
  }
}
</script>

<style scoped>
.main-content {
  min-height: 100vh;
  background: #000000;
  background-image:
    radial-gradient(ellipse at top, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
}

.footer {
  background: #000000;
  border-top: 1px solid rgba(168, 85, 247, 0.2);
  color: white;
  margin-top: 0;
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
  font-weight: 800;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  color: #ccc;
  line-height: 1.6;
  margin: 0;
}

.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
}

.copyright {
  color: #999;
  margin: 0;
  font-size: 0.9rem;
}

/* Dark Mode */
.v-theme--darkTheme .main-content {
  background: #000000;
  background-image:
    radial-gradient(ellipse at top, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(236, 72, 153, 0.2) 0%, transparent 50%);
}

/* Responsive */
@media (max-width: 1366px) {
  .main-content {
    padding: 30px 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 32px 0 16px;
    text-align: center;
  }

  .footer-brand {
    max-width: 100%;
  }

  .footer-bottom {
    text-align: center;
    padding: 16px 0;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 20px 12px;
  }
}

</style>