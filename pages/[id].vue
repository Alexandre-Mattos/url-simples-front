<template></template>

<script>
export default {
  mounted() {
    this.redirect()
  },

  methods: {
    redirect() {
      window.location.href = `${this.$config.public.backendUrl}/${this.$route.params.id}`
    },
  },
}
</script>
