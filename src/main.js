import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/app.scss'
import firebaseVue from './firebase'
import './diretivas'

Vue.use(firebaseVue)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
