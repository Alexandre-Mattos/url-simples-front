<template></template>

<script>
export default {
  async created() {
    await this.redirect()
  },

  methods: {
    async redirect() {
      this.$router.push({
        path: `${this.$config.app.backendUrl}/${this.$route.params.id}`,
      })
    },
  },
}
</script>
