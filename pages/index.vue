<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container fluid class="px-0 py-0">
        <v-row no-gutters>
          <v-col cols="2" class="d-none d-lg-flex" v-if="showSideAds">
            <v-container class="px-0">
              <div class="sticky-ad d-flex justify-start align-start">
                <AdSense 
                  adId="ad-left-sidebar" 
                  height="600" 
                  width="160" 
                  format="vertical" 
                />
              </div>
            </v-container>
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
          
          <v-col cols="2" class="d-none d-lg-flex" v-if="showSideAds">
            <v-container class="px-0">
              <div class="sticky-ad d-flex justify-end align-start">
                <AdSense 
                  adId="ad-right-sidebar" 
                  height="600" 
                  width="160" 
                  format="vertical" 
                />
              </div>
            </v-container>
          </v-col>

        </v-row>
      </v-container>
    </v-main>
    
    <v-footer app padless>
      <v-card flat tile width="100%" class="text-center">
        <AdSense 
          v-if="showFooterAd"
          adId="ad-before-footer" 
          height="90" 
          width="728" 
          format="horizontal" 
          class="mx-auto my-2 ad-responsive"
        />
        
        <!-- <v-card-text>
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
import AdSense from '@/components/adSense.vue'

export default {
  name: 'IndexPage',
  components: {
    AppBar,
    GenerateUrl,
    AdSense
  },
  data() {
    return {
      socialIcons: [
        { icon: 'mdi-facebook' },
        { icon: 'mdi-twitter' },
        { icon: 'mdi-instagram' },
        { icon: 'mdi-linkedin' }
      ],
      showSideAds: true,
      showFooterAd: true
    }
  },
  mounted() {
    if (process.env.NODE_ENV !== 'production') {
      this.showSideAds = false;
      this.showFooterAd = false;
    }
    
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.showSideAds = window.innerWidth >= 1264; 
    }
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
</style>