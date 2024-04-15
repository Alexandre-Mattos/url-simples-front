<template></template>

<script>
export default {
  mounted() {
    this.redirect()
  },

  methods: {
    redirect() {
      window.location.href = `${this.$config.app.backendUrl}/${this.$route.params.id}`
    },
  },
}
</script>
