<template>
  <div class="ad-container" :class="{ 'mt-4': top, 'mb-4': bottom }">
    <div class="ad-label text-caption text-center grey--text">Anúncio</div>
    <ins
      :id="adId"
      class="adsbygoogle"
      :style="{ display: 'block', height: height + 'px', width: width + 'px' }"
      :data-ad-format="format"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
    ></ins>
  </div>
</template>

<script>
export default {
  name: 'AdSense',
  props: {
    adId: {
      type: String,
      required: true
    },
    format: {
      type: String,
      default: 'auto'
    },
    height: {
      type: Number,
      default: 90
    },
    width: {
      type: Number,
      default: 728
    },
    top: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
    },
    adSlot: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      adClient: ''
    }
  },
  mounted() {
    this.adClient = this.$config.app.adsenseClient;
    this.$nextTick(() => {
      this.loadAd();
    });
  },
  methods: {
    loadAd() {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Erro ao carregar anúncio:', e);
      }
    }
  }
}
</script>

<style scoped>
.ad-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.ad-label {
  font-size: 10px;
  opacity: 0.7;
  margin-bottom: 4px;
}

.adsbygoogle {
  background-color: rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}
</style>