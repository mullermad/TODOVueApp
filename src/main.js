import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import apolloClient from "./Apollo";

import { DefaultApolloClient } from "@vue/apollo-composable";
  createApp(App)
    .use(router)
    .provide(DefaultApolloClient, apolloClient)
    .mount("#app");