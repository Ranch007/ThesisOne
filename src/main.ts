import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { persistencePlugin } from './stores/persistence'
import './assets/styles/reset.css'
import './assets/editor.css'
import './assets/preview.css'
import './assets/components.css'
import './assets/print.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(persistencePlugin)
app.use(pinia)
app.mount('#app')
