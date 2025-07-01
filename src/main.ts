import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import LoadingAnimation from '@/components/loading.vue';
const app = createApp(App);


app.component('LoadingAnimation', LoadingAnimation)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
