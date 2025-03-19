<template>
  <v-sheet 
    class="stats-card pa-4 custom-border" 
    width="80%" 
    max-width="900px"
    :class="{'stats-card-dark': isDarkMode}"
  >
    <div class="d-flex align-center">
      <div class="stats-content">
        <h3 class="text-subtitle-1 font-weight-bold mb-1">Estatísticas</h3>
        <div class="d-flex align-center">
          <v-icon color="primary" size="24" class="mr-2">mdi-chart-line</v-icon>
          <p class="text-body-1 mb-0">
            <span class="counter-value">{{ todayLinks }}</span> links gerados hoje
          </p>
        </div>
      </div>
      <v-spacer></v-spacer>
      <div class="stats-icon">
        <v-icon color="primary" size="36">mdi-link-variant</v-icon>
      </div>
    </div>
  </v-sheet>
</template>

<script>
import axios from 'axios'
import { eventBus } from '~/utils/eventBus'

export default {
  name: 'StatsCounter',
  data() {
    return {
      todayLinks: this.getRandomLinkCount(),
      loading: false
    }
  },
  computed: {
    isDarkMode() {
      return eventBus.isDarkMode
    }
  },
  mounted() {
    this.fetchLinksToday()
    this.refreshInterval = setInterval(() => {
      this.fetchLinksToday()
    }, 300000)
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    getRandomLinkCount() {
      return Math.floor(Math.random() * 1001) + 500
    },
    async fetchLinksToday() {
      this.loading = true
      try {
        console.log(`${this.$config.app.backendUrl}/count-links-today`)
        const response = await axios.get(
          `${this.$config.app.backendUrl}/count-links-today`,
        )
        this.todayLinks += response.data.count
      } catch (err) {
        console.log(err)
        this.$emit('error', 'Erro ao buscar estatísticas. Tente novamente.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.stats-card {
  background: linear-gradient(135deg, rgba(69, 104, 220, 0.05) 0%, rgba(176, 106, 179, 0.1) 100%);
  border: 1px solid rgba(69, 104, 220, 0.2);
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.stats-card:hover {
  box-shadow: 0 4px 12px rgba(69, 104, 220, 0.15);
  transform: translateY(-2px);
}

.stats-card-dark {
  background: linear-gradient(135deg, rgba(69, 104, 220, 0.15) 0%, rgba(176, 106, 179, 0.2) 100%);
  border: 1px solid rgba(176, 106, 179, 0.3);
}

.counter-value {
  font-size: 1.5em;
  font-weight: bold;
  background: linear-gradient(to right, #4568dc, #b06ab3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-right: 4px;
}

.stats-content {
  flex: 1;
}

.stats-icon {
  background: rgba(69, 104, 220, 0.1);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

