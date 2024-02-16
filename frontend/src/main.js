import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue3-cookies'
import { createPinia } from 'pinia'
import { APIPlugin } from '@/plugins/api';
import { RouterPlugin } from '@/plugins/router'

const app = createApp(App)

app.use(VueCookies)
app.use(createPinia())
app.use(APIPlugin)
app.use(RouterPlugin)

app.mount('#app')
