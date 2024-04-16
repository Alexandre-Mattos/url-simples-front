<template>
  <v-container class="body">
    <v-row no-gutters>
      <v-col
        cols="12"
        align-self="center"
        class="d-flex flex-column align-center"
      >
        <v-sheet class="d-flex justify-center" height="15vh">
          <h1>
            Use links menores no seu dia a dia com Curtinho!
          </h1>
        </v-sheet>
        <v-sheet
          class="pa-8 custom-elevation custom-border"
          width="70%"
          align-center
        >
          <h2>Insira um link para encurtar:</h2>
          <v-sheet width="100%" class="mx-auto my-4">
            <v-form @submit.prevent="submit">
              <v-sheet class="d-flex">
                <v-row no-gutters>
                  <v-col cols="10" xs="12" class="pr-4">
                    <v-text-field
                      :rules="rules"
                      v-model="originalUrl"
                      label="Cole o link aqui"
                      variant="solo-filled"
                    />
                  </v-col>
                  <v-col cols="2" xs="12">
                    <v-btn
                      type="submit"
                      height="6vh"
                      width="14vh"
                      :loading="loading"
                      :disabled="!originalUrl"
                      class="btn-color"
                    >
                      GERAR LINK
                    </v-btn>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-form>
          </v-sheet>
          <v-divider v-if="newUrls.length > 0" />
          <v-sheet
            v-for="(newUrl, index) in newUrls"
            :key="index"
            class="my-4 d-flex"
          >
            <v-text-field variant="solo-filled" class="mt-2 col-3" readonly>
              {{ newUrl }}
            </v-text-field>

            <v-btn
              class="mt-4 ml-4 btn-color"
              color="blue"
              type="submit"
              width="5%"
              @click="copy(newUrl)"
            >
              <v-icon>
                mdi-content-copy
              </v-icon>
            </v-btn>
            <v-btn
              class="mt-4 ml-3 btn-color"
              color="red"
              type="button"
              width="5%"
              @click="removerUrl(index)"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    originalUrl: '',
    newUrls: [],
    loading: false,
    rules: [
      (value) => {
        if (value) return true

        return 'Insira a url'
      },
    ],
  }),

  methods: {
    async submit() {
      this.loading = true

      await axios
        .post(
          `${this.$config.app.backendUrl}/encurtar`,
          {
            url: this.originalUrl,
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
          },
        )
        .then((res) => {
          this.loading = false
          this.originalUrl = ''
          this.newUrls.push(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    removerUrl(index) {
      this.newUrls.splice(index, 1)
    },

    copy(value) {
      navigator.clipboard.writeText(value)
    },
  },
}
</script>

<style scoped>
.body {
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.custom-border {
  border-radius: 24px;
}

.btn-color {
  background: linear-gradient(to right, #4568dc, #b06ab3);
  color: white;
}

.custom-elevation {
  box-shadow: 0 2px 12px rgba(121, 121, 121, 0.2);
}
</style>
