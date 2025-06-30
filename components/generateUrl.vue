<template>
  <v-container class="body">
    <v-row no-gutters>
      <v-col
        cols="12"
        align-self="center"
        class="d-flex flex-column align-center"
      >

        <v-sheet class="mt-6 mb-6 pa-4 custom-border info-card" width="80%" max-width="900px">
          <div class="d-flex align-center">
            <div>
              <h3 class="text-subtitle-1 font-weight-bold mb-1">Por que usar o Curtinho?</h3>
              <p class="text-body-2">
                Links curtos são mais fáceis de compartilhar, memorizar e ficam melhores em suas mensagens.
              </p>
            </div>
            <v-spacer></v-spacer>
            <v-icon color="primary" size="36">mdi-rocket-launch-outline</v-icon>
          </div>
        </v-sheet>

        <StatsCounter @error="showSnackbar" class="mb-4" />

        <v-sheet
          class="pa-8 custom-elevation custom-border"
          width="80%"
          max-width="900px"
          align-center
        >
          <h2 class="mb-">Insira um link para encurtar:</h2>
          <v-sheet width="100%" class="mx-auto my-4">
            <v-form @submit.prevent="submit" ref="form">
              <v-sheet>
                <v-row class="d-flex flex-wrap">
                  <v-col cols="12" lg="10" class="pr-lg-4">
                    <v-text-field
                      :rules="urlRules"
                      v-model="originalUrl"
                      label="Cole o link aqui"
                      placeholder="https://exemplo-de-um-link-muito-longo.com/pagina"
                      :variant="'outlined'"
                      class="text-wrap url-input"
                      prepend-inner-icon="mdi-link-variant"
                      clearable
                      @keyup.enter="submit"
                      :error-messages="[]"
                      validate-on="submit"
                    />
                  </v-col>

                  <v-col cols="12" lg="2" class="pr-lg-4">
                    <v-btn
                      type="submit"
                      :loading="loading"
                      :disabled="!isValidUrl"
                      class="btn-color btn-size"
                      elevation="2"
                    >
                      <v-icon left>mdi-link</v-icon>
                      GERAR LINK
                    </v-btn>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-form>
          </v-sheet>
          
          <v-expand-transition>
            <div v-if="newUrls.length > 0">
              <v-divider class="my-4" />
              
              <v-sheet
                v-for="(url, index) in newUrls"
                :key="index"
                class="my-4 url-item pa-2"
                :class="{'dark-item': isDarkMode}"
                rounded
              >
                <v-row class="flex-wrap">
                  <v-col cols="12" lg="8">
                    <v-text-field
                      :variant="'outlined'"
                      class="mt-2 text-wrap"
                      readonly
                      :value="url"
                      hide-details
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4" class="d-flex align-center">
                    <v-btn
                      class="mt-0 mt-lg-0 btn-color"
                      @click="copy(url)"
                      :disabled="copiedIndex === index"
                    >
                      <v-icon left>
                        {{ copiedIndex === index ? 'mdi-check' : 'mdi-content-copy' }}
                      </v-icon>
                      {{ copiedIndex === index ? 'Copiado!' : 'Copiar' }}
                    </v-btn>
                    
                    <v-btn
                      class="mt-0 mt-lg-0 ml-2 btn-color-secondary"
                      @click="openUrl(url)"
                      icon
                    >
                      <v-icon>mdi-open-in-new</v-icon>
                    </v-btn>
                    
                    <v-btn
                      class="mt-0 mt-lg-0 ml-2 btn-color-secondary"
                      @click="removerUrl(index)"
                      icon
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                
                <v-expand-transition>
                  <div v-if="expandedIndex === index" class="px-4 pb-2">
                    <v-divider class="mb-2" />
                    <p class="text-caption">
                      Criado em: {{ formatDate(new Date()) }}
                    </p>
                  </div>
                </v-expand-transition>
              </v-sheet>
              
              <div class="text-center mt-4" v-if="newUrls.length > 1">
                <v-btn text color="primary" @click="clearAll">
                  <v-icon left>mdi-delete-sweep</v-icon>
                  Limpar todos
                </v-btn>
              </div>
            </div>
          </v-expand-transition>
        </v-sheet>
        
        <div class="ad-container mt-4">
          <div class="ad-label">Anúncio</div>
          <ins
            class="adsbygoogle ad-bottom"
            style="display:block"
            data-ad-client="ca-pub-9345726529573024"
            data-ad-slot="1636237991"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </v-col>
    </v-row>
    
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
import { eventBus } from '~/utils/eventBus'
import StatsCounter from '@/components/statsCounter.vue'

export default {
  name: 'GenerateUrl',
  components: {
    StatsCounter
  },
  data() {
    return {
      originalUrl: '',
      newUrls: [],
      loading: false,
      copiedIndex: null,
      expandedIndex: null,
      adsLoaded: false,
      showValidation: false,
      snackbar: {
        show: false,
        text: '',
        color: 'success',
        timeout: 3000
      }
    }
  },
  
  computed: {
    urlRules() {
      return [
        v => {
          if (!this.showValidation) return true
          return !!v || 'URL é obrigatória'
        },
        v => {
          if (!this.showValidation || !v) return true
          try {
            new URL(v)
            return true
          } catch (e) {
            return 'URL inválida. Inclua http:// ou https://'
          }
        }
      ]
    },
    isValidUrl() {
      if (!this.originalUrl) return false
      try {
        new URL(this.originalUrl)
        return true
      } catch (e) {
        return false
      }
    },
    isDarkMode() {
      return eventBus.isDarkMode
    }
  },
  
  mounted() {
    const savedUrls = localStorage.getItem('curtinho_history')
    if (savedUrls) {
      try {
        this.newUrls = JSON.parse(savedUrls)
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }
    
    this.loadAds()
  },

  methods: {
    loadAds() {
      this.$nextTick(() => {
        try {
          const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
          ads.forEach(() => {
            if (this.$loadAd) {
              this.$loadAd();
            }
          });
        } catch (e) {
          console.error('Erro ao carregar anúncios:', e);
        }
      });
    },

    async submit() {
      this.showValidation = true
      if (!this.$refs.form.validate()) return
      
      this.loading = true

      try {
        const response = await axios.post(
          `${this.$config.app.backendUrl}/encurtar`,
          {
            url: this.originalUrl,
          },
        )
        
        this.loading = false
        this.originalUrl = ''
        this.newUrls.unshift(response.data)
        
        localStorage.setItem('curtinho_history', JSON.stringify(this.newUrls))
        
        this.showSnackbar('Link encurtado com sucesso!', 'success')
        
        if (this.newUrls.length === 1) {
          setTimeout(() => {
            this.loadAds()
          }, 100)
        }
      } catch (err) {
        console.log(err)
        this.loading = false
        this.showSnackbar('Erro ao encurtar o link. Tente novamente.', 'error')
      }
    },

    removerUrl(index) {
      this.newUrls.splice(index, 1)
      localStorage.setItem('curtinho_history', JSON.stringify(this.newUrls))
      this.showSnackbar('Link removido', 'info')
    },

    copy(value) {
      const index = this.newUrls.indexOf(value)
      
      navigator.clipboard.writeText(value)
        .then(() => {
          this.copiedIndex = index
          this.showSnackbar('Link copiado para a área de transferência!', 'success')
          setTimeout(() => {
            this.copiedIndex = null
          }, 2000)
        })
        .catch(err => {
          console.error('Erro ao copiar:', err)
          this.showSnackbar('Erro ao copiar o link', 'error')
        })
    },
    
    openUrl(url) {
      window.open(url, '_blank')
    },
    
    clearAll() {
      this.newUrls = []
      localStorage.setItem('curtinho_history', JSON.stringify(this.newUrls))
      this.showSnackbar('Todos os links foram removidos', 'info')
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
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
.body {
  min-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-width: 60vw;
}

.btn-color {
  background: linear-gradient(to right, #4568dc, #b06ab3);
  color: white;
}

.btn-color-secondary {
  background: rgba(69, 104, 220, 0.1);
  color: #4568dc;
}

.btn-size {
  font-size: 0.8em !important;
  height: 73%;
  width: 100%;
  min-width: 100%;

  @media screen and (max-width: 1280px) {
    font-size: 0.8em;
    height: 56px;
  }
}

.card {
  font-size: 0.7em;
  display: flex;
  align-items: center;
}

.custom-border {
  border-radius: 24px;
}

.custom-elevation {
  box-shadow: 0 2px 12px rgba(121, 121, 121, 0.2);
}

.text-wrap {
  min-width: 100%;
  overflow: hidden;
}

.url-item {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.url-item:hover {
  box-shadow: 0 4px 12px rgba(69, 104, 220, 0.15);
}

.dark-item {
  background-color: rgba(30, 30, 30, 0.7);
}

.info-card {
  border: 1px dashed rgba(69, 104, 220, 0.3);
  background-color: rgba(69, 104, 220, 0.05);
}

.ad-responsive {
  width: 100%;
  max-width: 728px;

  @media screen and (max-width: 768px) {
    max-width: 320px;
  }
}

h1 {
  font-size: 2.2em;
  
  @media screen and (max-width: 1280px) {
    font-size: 1.8em;
  }
}

h2 {
  font-size: 1.5em;
  
  @media screen and (max-width: 1280px) {
    font-size: 1.2em;
  }
}

.ad-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.ad-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.adsbygoogle {
  display: block !important;
  min-height: 280px;
}

@media (max-width: 768px) {
  .adsbygoogle {
    min-height: 250px;
  }
}

.url-input {
  min-height: 56px;
}

.url-input :deep(.v-field) {
  min-height: 56px;
}

.url-input :deep(.v-field__input) {
  min-height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.url-input :deep(.v-field__prepend-inner) {
  padding-top: 12px;
}
</style>