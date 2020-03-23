<template>
<div class="alert alert-dismissible fade show" v-if="show" :class="`alert-${type}`">
 {{ message }}
  <button type="button" class="close" @click="close()">
    <span >&times;</span>
  </button>
</div>
</template>
<script>
export default {
  data: () => ({
    show: false,
    type: 'danger',
    message: ''
  }),
  created () {
    this.$root.$on('Notification::show', payload => {
      this.show = true
      this.type = payload.type
      this.message = payload.message

      setTimeout(() => { this.close() }, payload.timeout || 4000)
    })
  },
  methods: {
    close () {
      this.message = ''
      this.type = 'danger'
      this.show = false
    }
  }
}
</script>
<style lang="scss">
</style>
