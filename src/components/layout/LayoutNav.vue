<template>
  <nav class="nav flex-column justify-content-between">
    <div>
    <router-link
      v-for="( router, i ) in routerLinks"
      class="nav-link"
      :key="i"
      :to="{ name: router.name }"
      exact
      exact-active-class="active"
    >
    <i class="fa" :class="`fa-${router.meta.icon}`"></i>
    {{ router.meta.title }}
    </router-link>
    <hr>
    <layout-base/>
    </div>
    <layout-logout/>
  </nav>
</template>
<script>
import LayoutLogout from './LayoutLogout'
import LayoutBase from './LayoutBase'

export default {
  components: {
    LayoutLogout,
    LayoutBase
  },
  computed: {
    routerLinks () {
      return this.$router.options.routes.filter(r => r.name !== 'login')
    }
  }
}
</script>
<style lang="scss" scoped>
.nav {
  margin-left: -15px;
  height: calc(100vh - 49px);
  width: calc(100% + 30px);
  .nav-link {
    color: #fff;
    transition: 0.4s;
    &.active {
      color: #F89600;
    }
    &:hover {
      color: #111;
      background-color: #F89600;
    }
  }
}
</style>
