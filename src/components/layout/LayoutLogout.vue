<template>
 <button class="btn btn-logout" @click="logout()">
   <i class="fa fa-power-off"></i>
   Sair</button>
</template>
<script>
export default {
  methods: {
    async logout () {
      this.$root.$emit('Spinner::show')

      await this.$firebase.auth().signOut()

      this.$router.push({ name: 'login' })

      this.$root.$emir('Spinner::hide')
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-logout{
  width: 100%;
  cursor: pointer;
  color: #fff;
  &:hover{color: orange;}
}
</style>
