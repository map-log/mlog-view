import { createApp } from "vue";
import { DatePicker } from "ant-design-vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(DatePicker);

app.mount("#app");
