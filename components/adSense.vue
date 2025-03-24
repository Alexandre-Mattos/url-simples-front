<template>
  <div>
    <!-- O AdSense automático não precisa de um container específico, 
         pois o Google decide onde colocar os anúncios -->
  </div>
</template>

<script>
export default {
  name: 'AdSense',
  props: {
    adClient: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.loadAutoAds();
  },
  methods: {
    loadAutoAds() {
      try {
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adClient}`;
          script.crossOrigin = 'anonymous';
          
          document.head.appendChild(script);
          
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({
            google_ad_client: this.adClient,
            enable_page_level_ads: true
          });
        }
      } catch (e) {
        console.error('Erro ao carregar anúncios automáticos:', e);
      }
    }
  }
}
</script>

