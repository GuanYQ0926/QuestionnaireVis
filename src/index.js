import Vue from 'vue'
import App from './App.vue'
import {
  Button,
  Row,
  Transfer,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'


Vue.use(Transfer)
Vue.use(Row)
Vue.use(Button)
locale.use(lang)

const eventHub = new Vue()
Vue.mixin({
  data: () => ({eventHub})
})
new Vue({
  el: '#app',
  render: h => h(App)
})
