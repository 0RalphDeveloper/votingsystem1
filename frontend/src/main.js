import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'  // import the router
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App)
app.use(router)  // use the router
app.mount('#app')