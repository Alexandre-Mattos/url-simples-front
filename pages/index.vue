<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container fluid class="px-0 py-0">
        <v-row no-gutters>
          <v-col cols="2" class="d-none d-lg-flex">
            <div class="sticky-ad">
              <div class="ad-container">
                <div class="ad-label" align-center>Anúncio</div>
                <ins
                  class="adsbygoogle"
                  style="display:block"
                  data-ad-client="ca-pub-9345726529573024"
                  data-ad-slot="1111111111"
                  data-ad-format="vertical"
                  data-full-width-responsive="true"
                ></ins>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" lg="8">
            <v-container class="content">
              <v-row class="d-flex flex-column">
                <v-col>
                  <GenerateUrl />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          
          <v-col cols="2" class="d-none d-lg-flex">
            <div class="sticky-ad">
              <div class="ad-container">
                <div class="ad-label">Anúncio</div>
                <ins
                  class="adsbygoogle"
                  style="display:block"
                  data-ad-client="ca-pub-9345726529573024"
                  data-ad-slot="2222222222"
                  data-ad-format="vertical"
                  data-full-width-responsive="true"
                ></ins>
              </div>
            </div>
          </v-col>

        </v-row>
      </v-container>
    </v-main>
    
    <v-footer app padless>
      <v-card flat tile width="100%" class="text-center">
        <!-- <AdSense 
          v-if="showFooterAd"
          adId="ad-before-footer" 
          height="90" 
          width="728" 
          format="horizontal" 
          class="mx-auto my-2 ad-responsive"
        />
        
        <v-card-text>
          <v-btn
            v-for="icon in socialIcons"
            :key="icon.icon"
            class="mx-2"
            icon
            color="primary"
          >
            <v-icon>{{ icon.icon }}</v-icon>
          </v-btn>
        </v-card-text> -->
        <v-divider></v-divider>
        <v-card-text class="text-caption">
          {{ new Date().getFullYear() }} — <strong>Curtinho</strong> | Encurtador de URLs simples e rápido
        </v-card-text>
      </v-card>
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
      socialIcons: [
        { icon: 'mdi-facebook' },
        { icon: 'mdi-twitter' },
        { icon: 'mdi-instagram' },
        { icon: 'mdi-linkedin' }
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadSideAds();
    });
  },
 
  methods: {
    loadSideAds() {
      this.$nextTick(() => {
        try {
          const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
          ads.forEach(() => {
            if (window.$loadAd) {
              window.$loadAd();
            }
          });
        } catch (e) {
          console.error('Erro ao carregar anúncios laterais:', e);
        }
      });
    },
    
  
  }
}
</script>

<style scoped>
.content {
  width: 100%;
  padding-bottom: 80px; 
}

.sticky-ad {
  position: sticky;
  top: 80px;
  height: auto;
  min-height: 600px;
  padding: 16px 0;
}

.ad-responsive {
  width: 100%;
  max-width: 728px;

  @media screen and (max-width: 768px) {
    max-width: 320px;
  }
}

.ad-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  width: 100%;
}

.ad-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.adsbygoogle {
  display: block !important;
  width: 160px;
  height: 600px;
}
</style>