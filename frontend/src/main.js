import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { AuthPlugin } from './plugins/auth';
import { APIPlugin } from './plugins/api';
import { RouterPlugin } from './plugins/router'

const app = createApp(App)

app.use(createPinia())
app.use(AuthPlugin)
app.use(APIPlugin, { authPlugin: app.config.globalProperties.$auth })
app.use(RouterPlugin, { authPlugin: app.config.globalProperties.$auth })

app.mount('#app')
