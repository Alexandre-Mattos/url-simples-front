<template></template>

<script>
export default {
  created() {
    this.redirect()
  },

  methods: {
    async redirect() {
      window.location.href = `${this.$config.app.backendUrl}/${this.$route.params.id}`
    },
  },
}
</script>
