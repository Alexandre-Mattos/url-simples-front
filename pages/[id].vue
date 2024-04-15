<template></template>

<script>
export default {
  async created() {
    await this.redirect()
  },

  methods: {
    async redirect() {
      window.location.href = `${this.$config.app.backendUrl}/${this.$route.params.id}`
    },
  },
}
</script>
