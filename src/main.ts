import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { persistencePlugin } from './stores/persistence'
import './assets/styles/reset.css'
import './assets/styles/variables.css'
import './assets/styles/editor.css'
import './assets/styles/preview.css'
import './assets/styles/components.css'
import './assets/styles/print.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(persistencePlugin)
app.use(pinia)
app.mount('#app')
