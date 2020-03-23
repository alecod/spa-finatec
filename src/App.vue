<template>
  <div id="app">
    <base-spinner/>
    <layout-notification/>
    <div class="container-fluid" v-if="isLogged">
      <div class="row">
        <div class="col-2 navgation-sidebar">
         <h2 class="app-title">Menu</h2>
        <layout-nav/>
        </div>
        <div class="col" style="padding: 0;     margin-left: -14px;">
         <router-view/>
        </div>
      </div>
    </div>
    <router-view v-else/>
  </div>
</template>

<script>
import BaseSpinner from './components/global/BaseSpinner'
import LayoutNav from './components/layout/LayoutNav'
import LayoutNotification from './components/layout/LayoutNotification'

export default {
  name: 'App',
  components: {
    BaseSpinner,
    LayoutNav,
    LayoutNotification
  },
  data: () => ({ isLogged: false }),
  mounted () {
    this.$firebase.auth().onAuthStateChanged(user => {
      window.uid = user ? user.uid : null
      this.isLogged = !!user
      console.log(window.uid)
      this.$router.push({ name: window.uid ? 'home' : 'login' })
      setTimeout(() => {
        this.$root.$emit('Spinner::hide')
      }, 300)
    })
  }
}
</script>

<style lang="scss">
body{
  overflow: hidden;
}
#app{
  min-height: 100vh;
  background-color: #111;
  color: #fff;
  overflow: hidden;
  .navgation-sidebar {
    background-color: #333;
  }
  .app-title {
    font-size: 20pt;
    margin-top: 10px;
    text-align: center;
  }
}
</style>
